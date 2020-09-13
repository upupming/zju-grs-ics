import { IConfig } from './types'

export const config: IConfig = {
  // 记得改为自己的 cookie
  cookie: 'JSESSIONID=9F972A0AD69FD2C4BE6C7463CB1FB869; xxxxxx locale=zh_CN',
  fall: {
    firstWeekOfYear: 38,
    lastWeekDay: '2020-11-29',
    sectionCourseUrl: 'http://grs.zju.edu.cn/py/page/student/grkcb.htm?xj=13&xn=2020'
  },
  winter: {
    firstWeekOfYear: 49,
    lastWeekDay: '2021-01-28',
    sectionCourseUrl: 'http://grs.zju.edu.cn/py/page/student/grkcb.htm?xj=13&xn=2020'
  },
  year: 2020
}
