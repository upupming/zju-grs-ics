/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as ics from 'ics'
import { writeFileSync } from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import axios from 'axios'
import cheerio from 'cheerio'
import { config } from './config'
import { IGrsCourseInfo, SectionNo, ZhNumber } from './types'
import { minify } from 'html-minifier'
import { course2Events, zh2number } from './helper'

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

  const cheerioELe2Course = (chooseStatus: string) => (idx: number, ele: CheerioElement): void => {
    const tmpCourses = []
    let remarks = ''

    // ele 是一个 td
    // console.log(ele)
    const tr = ele.parent
    // console.log(tr.children[2].children[0].children[0].data!, tr)
    const courseInfoTd = tr.children[8]

    // 每周只有一节课：0 - 9, 10 - 11
    // 每周有两节课：0 - 9, 10 - 19, 20 - 21
    for (let i = 0; ; i += 10) {
      if (i + 2 >= courseInfoTd.children.length) {
        // console.log('i', i)
        remarks = courseInfoTd.children[i + 1]?.data || ''
        break
      }
      // console.log('i', i)

      // 例如「秋（每周）」
      const periodText = courseInfoTd.children[i + 1].data!
      const periodTextWeekRangeStartIndex = periodText.indexOf('(') + 1
      const periodTextWeekRangeEndIndex = periodText.indexOf(')')

      // 例如 6-8 节
      const sectionText = courseInfoTd.children[i + 5].data!
      const sectionRange = sectionText.match(/\d+/g)!

      const grsCourseInfo: IGrsCourseInfo = {
        title: tr.children[2].children[0].children[0].data!,
        season: tr.children[6].children[0].data! as IGrsCourseInfo['season'],
        weeksRange: periodText.substring(periodTextWeekRangeStartIndex, periodTextWeekRangeEndIndex) as IGrsCourseInfo['weeksRange'],
        startSection: parseInt(sectionRange[0]) as SectionNo,
        endSection: parseInt(sectionRange[1]) as SectionNo,
        teacher: tr.children[7].children[0].data!,
        address: courseInfoTd.children[i + 8].data!,
        weekDay: zh2number[courseInfoTd.children[i + 3].data!.slice(2) as ZhNumber],
        remarks,
        chooseStatus
      }

      tmpCourses.push(grsCourseInfo)
    }
    courses.push(...(tmpCourses.map(course => ({
      ...course,
      remarks
    }))))
  }

  [
    // 已经选上课的
    '正在修读',
    // 待处理，即等待院系审批
    '待处理',
    // 还在等待列表的
    '等待列表'
  ].map(chooseStatus => ($(`table.table-bordered-xk > tbody > tr > td[name="${chooseStatus}"]`).map(cheerioELe2Course(chooseStatus))))

  return courses
}

if (!config.cookie) {
  console.error('请按照 README 提供 Cookie 用于请求数据')
  process.exit()
}

Promise.all([
  getCourses('http://grs.zju.edu.cn/py/page/student/grkcgl.htm')
])
  .then(async (res) => {
    const courses = res[0]
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
  .catch(async err => {
    console.log('课程获取失败', err)
  })

// console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// 无限等待，防止 log 变量在 Chrome devtools 里面消失，方便调试
if (process.env.NODE_ENV === 'development') {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 10000000)
  }).catch(() => {})
}
