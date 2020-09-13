import { EventAttributes } from 'ics'
import { IGrsCourseInfo, SeasonKey, SeasonValue } from './types'
import dayjs from 'dayjs'
import { config } from './config'

export const section2StartTime = {
  一: [8, 0],
  二: [8, 50],
  三: [9, 50],
  四: [10, 40],
  五: [11, 30],
  六: [13, 15],
  七: [14, 5],
  八: [14, 55],
  九: [15, 55],
  十: [16, 45],
  十一: [18, 30],
  十二: [19, 20],
  十三: [20, 10],
  十四: [21, 0]
}

export const section2EndTime = {
  一: [8, 45],
  二: [9, 35],
  三: [10, 35],
  四: [11, 25],
  五: [12, 15],
  六: [14, 0],
  七: [14, 50],
  八: [15, 40],
  九: [16, 40],
  十: [17, 30],
  十一: [19, 15],
  十二: [20, 5],
  十三: [20, 55],
  十四: [21, 45]
}

/** 星期一作为一周的第一天，获取指定周的周一的 Date 对象 */
export const getDateOfISOWeek = (w: number, y: number): Date => {
  var simple = new Date(y, 0, 1 + (w - 1) * 7)
  var dow = simple.getDay()
  var ISOWeekStart = simple
  if (dow <= 4) ISOWeekStart.setDate(simple.getDate() - simple.getDay() + 1)
  else ISOWeekStart.setDate(simple.getDate() + 8 - simple.getDay())
  return ISOWeekStart
}

/** 子元素在父元素中的 index */
export const getElementIndexInParent = (element: CheerioElement): number => {
  let i = 0
  while ((element = element.previousSibling) != null && element.attribs.rowspan !== '5') { i++ }
  return i
}

export const seasonId2Text: { [key in SeasonKey]: SeasonValue } = {
  fall: '秋',
  winter: '冬'
}

export const course2Events = (courses: IGrsCourseInfo[], seasonId: 'fall' | 'winter'): EventAttributes[] => {
  const events: EventAttributes[] = []

  const fallLastWeekDay = dayjs(config[seasonId].lastWeekDay)
  for (let weekNo = config[seasonId].firstWeekOfYear, i = 1; ; weekNo++, i++) {
    const isOdd = i % 2 === 1

    const weekMonday = dayjs(getDateOfISOWeek(weekNo, config.year))

    // 当前周已经超过学期最后一天，结束循环
    if (fallLastWeekDay.isBefore(weekMonday)) break
    for (const course of courses) {
      const date = weekMonday.add(course.weekDay - 1, 'day')

      // 1. 课程在学期有开课
      // 2. 日期在结束日期之前
      // 3. 周数符合条件
      if (
        course.season.includes(seasonId2Text[seasonId]) &&
        date.isBefore(fallLastWeekDay) &&
        (course.weeksRange === '每周' || (course.weeksRange === '单周' && isOdd) || (course.weeksRange === '双周' && !isOdd))) {
        const event: EventAttributes = {
          title: course.title,
          start: [date.year(), date.month() + 1, date.date(), section2StartTime[course.startSection][0], section2StartTime[course.startSection][1]],
          end: [date.year(), date.month() + 1, date.date(), section2EndTime[course.endSection][0], section2EndTime[course.endSection][1]],
          location: course.address,
          description: `授课教师：${course.teacher}\n本日程由 zju-grs-ics 生成\n问题反馈：https://github.com/upupming/zju-grs-ics/issues`
        }
        events.push(event)
      }
    }
  }

  return events
}
