/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ics from 'ics'
import { writeFileSync } from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import axios from 'axios'
import cheerio from 'cheerio'
import { config } from './config'
import { IGrsCourseInfo, SectionNo } from './types'
import { minify } from 'html-minifier'
import { course2Events, getElementIndexInParent } from './helper'

const outputDir = path.join(__dirname, '../output')
const outputFile = path.resolve(outputDir, 'courses.ics')

const getCourses = async (courseUrl: string): Promise<IGrsCourseInfo[]> => {
  const res = await axios.get<string>(courseUrl, {
    headers: {
      Cookie: config.cookie
    }
  })
  // minify 删去空格防止 cheerio 多算一些 text tag 元素，计算 child index 的时候和 chrome 表现不一致，不方便调试
  const html = minify(res.data, {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true
  })
  // console.log('html', html)

  const courses: IGrsCourseInfo[] = []

  const $ = cheerio.load(html)

  $('table.table-course > tbody > tr > td > a').map((idx, ele) => {
    const seasonAndWeeksRange = ele.children[2].data!.split('||').map(s => s.trim())
    const sectionRange = ele.children[4].data!.split('--').map(r => {
      return r.trim().slice(1, -1)
    })

    const grsCourseInfo: IGrsCourseInfo = {
      title: ele.children[0].children[0].data!,
      season: seasonAndWeeksRange[0] as IGrsCourseInfo['season'],
      weeksRange: seasonAndWeeksRange[1] as IGrsCourseInfo['weeksRange'],
      startSection: sectionRange[0] as SectionNo,
      endSection: sectionRange[1] as SectionNo,
      teacher: ele.children[6].data!.trim(),
      address: ele.children[8].data!.trim(),
      weekDay: getElementIndexInParent(ele.parent)
    }

    courses.push(grsCourseInfo)
  })

  return courses
}

if (!config.cookie) {
  console.error('请按照 README 提供 Cookie 用于请求数据')
  process.exit()
}

Promise.all([
  getCourses(config.fall.sectionCourseUrl),
  getCourses(config.winter.sectionCourseUrl)
])
  .then(async (res) => {
    const titles = new Set(res[0].map(c => c.title))

    const courses = [
      ...res[0],
      ...res[1].filter(c => !titles.has(c.title))
    ]
    console.log('courses', courses)

    // 利用课程信息构造 ics 数据结构

    const fallEvents = course2Events(courses, 'fall')
    const winterEvents = course2Events(courses, 'winter')

    console.log('fallEvents', fallEvents)
    console.log('winterEvents', winterEvents)

    ics.createEvents([...fallEvents, ...winterEvents], (error, value) => {
      if (error) {
        console.error('ics 生成失败：', error)
        return
      }

      mkdirp(outputDir).then((res) => {
        writeFileSync(outputFile, value)
        console.log('文件已生成：', outputFile)
      }).catch(err => {
        console.error('文件夹生成失败：', err)
      })
    })
  })
  .catch(err => {
    console.log('课程获取失败', err)
  })
