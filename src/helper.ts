import { EventAttributes } from 'ics'
import { IGrsCourseInfo, SeasonKey, SeasonValue } from './types'
import dayjs from 'dayjs'
import { config } from './config'

export const zh2number = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7
}

export const section2StartTime = {
  1: [8, 0],
  2: [8, 50],
  3: [9, 50],
  4: [10, 40],
  5: [11, 30],
  6: [13, 15],
  7: [14, 5],
  8: [14, 55],
  9: [15, 55],
  10: [16, 45],
  11: [18, 30],
  12: [19, 20],
  13: [20, 10],
  14: [21, 0]
}

export const section2EndTime = {
  1: [8, 45],
  2: [9, 35],
  3: [10, 35],
  4: [11, 25],
  5: [12, 15],
  6: [14, 0],
  7: [14, 50],
  8: [15, 40],
  9: [16, 40],
  10: [17, 30],
  11: [19, 15],
  12: [20, 5],
  13: [20, 55],
  14: [21, 45]
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

export const seasonId2Text: { [key in SeasonKey]: SeasonValue } = {
  fall: '秋',
  winter: '冬'
}

export const course2Events = (courses: IGrsCourseInfo[], seasonId: 'fall' | 'winter'): EventAttributes[] => {
  const events: EventAttributes[] = []

  const seasonLastWeekDay = dayjs(config[seasonId].lastWeekDay)
  for (let weekNo = config[seasonId].firstWeekOfYear, i = 1; ; weekNo++, i++) {
    const isOdd = i % 2 === 1

    const weekMonday = dayjs(getDateOfISOWeek(weekNo, config.year))

    // 当前周已经超过学期最后一天，结束循环
    if (seasonLastWeekDay.isBefore(weekMonday)) break
    for (const course of courses) {
      const date = weekMonday.add(course.weekDay - 1, 'day')

      // 1. 课程在学期有开课
      // 2. 日期在结束日期之前
      // 3. 周数符合条件
      if (
        course.season.includes(seasonId2Text[seasonId]) &&
        date.isBefore(seasonLastWeekDay) &&
        (course.weeksRange === '每周' || (course.weeksRange === '单周' && isOdd) || (course.weeksRange === '双周' && !isOdd))) {
        const event: EventAttributes = {
          title: course.title,
          start: [date.year(), date.month() + 1, date.date(), section2StartTime[course.startSection][0], section2StartTime[course.startSection][1]],
          end: [date.year(), date.month() + 1, date.date(), section2EndTime[course.endSection][0], section2EndTime[course.endSection][1]],
          location: course.address,
          description: `授课教师：${course.teacher}\n第 ${i} 周，第${course.startSection}到${course.endSection}节\n课程季节：${course.season}\n课程周期：${course.weeksRange}${course.remarks ? `\n${course.remarks}` : ''}\n本日程由 zju-grs-ics 生成\n问题反馈：https://github.com/upupming/zju-grs-ics/issues`
        }
        events.push(event)
      }
    }
  }

  return events
}
