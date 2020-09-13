import { IConfig } from './types'

export const config: IConfig = {
  // 记得改为自己的 cookie
  cookie: '',
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
