import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import path from 'path'

class ZhiHuDB extends JsonDB {
  getObjectSafe<T>(dataPath: string): T| null {
    let ans: T| null = null
    try {
      ans = this.getObject<T>(dataPath)
    } catch {
      console.log(`[db info]: 尚未创建 ${dataPath} 字段`)
    }
    return ans
  }
}

export const db = new ZhiHuDB(new Config(
  path.join(__dirname, '../data', 'ZhiHuData.json')
  , true, true, '/'))
