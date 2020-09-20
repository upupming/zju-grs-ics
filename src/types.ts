import { section2StartTime, zh2number } from './helper'

export interface ISectionConfig {
  /** 第一周是一年中的第几周，用来计算课程的具体日期 */
  firstWeekOfYear: number
  /** 学期最后一天 */
  lastWeekDay: string
}

export interface IConfig {
  /** grs 网站的 cookie，请自行替换成你的 cookie，不要随意泄露自己的 cookie */
  cookie: string
  /** 秋季学期 */
  fall: ISectionConfig
  /** 冬季学期 */
  winter: ISectionConfig
  /** 学期所在年份，用于计算第几周的具体 Date */
  year: number
}

export type SeasonKey = 'fall' | 'winter'
export type SeasonValue = '秋' | '冬'

export type SectionNo = keyof typeof section2StartTime
export type ZhNumber = keyof typeof zh2number

export interface IGrsCourseInfo {
  /** 课程名称 */
  title: string
  /** 课程季节 */
  season: '秋' | '冬' | '秋冬'
  /** 周数范围，`每周` 或者一个范围 */
  weeksRange: '每周' | '单周' | '双周'
  /** 星期几，1 - 7 */
  weekDay: number
  /** 课程开始节数 */
  startSection: SectionNo
  /** 课程结束节数 */
  endSection: SectionNo
  /** 任课老师 */
  teacher: string
  /** 授课地点 */
  address: string
  /** 备注 */
  remarks: string
  /** 选课状态 */
  chooseStatus: string
}
