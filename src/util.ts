import { defaultHeaders, cookieObject } from './const'
import crypto from 'crypto'

export const getEncryptSourceV = () => {
  return defaultHeaders['x-zse-83']
}
// /api/v4/search_v3?t=general&q=%E6%B5%8B%E8%AF%95&correction=1&offset=0&limit=20&lc_idx=0&show_all_topics=0
export const getEncryptSourceT = (href: string) => {
  const url = new URL(href)
  return (url.pathname + url.search)
}
export const getEncryptSourceG = () => {
  return cookieObject.d_c0
}
export const getEncryptSource = (v: string, t: string, g: string) => {
  const ans = crypto.createHash('md5').update(`${v}+${t}+${g}`).digest('hex')
  // console.log('getEncryptSource', `${v}+${t}+${g}`, ans)
  return ans
}
