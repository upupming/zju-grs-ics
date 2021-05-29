import axios from 'axios'
import { getSearchBeginHref, defaultHeaders, encryptHeaderKey, defaultKeyword, getQuestionHref, getQuestionLogHref, loggedCookie, getUserInfoAddress } from './const'
import encrypt from './encrypt'
import type { SearchData, QuestionInfo, UserInfo } from './types'
import { getEncryptSource, getEncryptSourceV, getEncryptSourceT, getEncryptSourceG } from './util'
import { db } from './db'
import cheerio from 'cheerio'

axios.interceptors.response.use(res => {
  // 对响应数据做些什么
  return res
}, err => {
  console.log(err)
  return { data: null }
})

const getUserInfo = async (userUrl: string) => {
  console.log(`getUserInfo: ${userUrl}...`)
  let ans = null
  try {
    ans = (await axios.get<UserInfo>(getUserInfoAddress(userUrl.slice(userUrl.lastIndexOf('/') + 1)))).data
  } catch (e) {
    console.log(e)
  }
  return ans
}

// 「标题」、「提问时间」
// 「提问者性别」、「提问者用户名」、「提问者是否已认证」 (匿名用户的话是没有这个的)
const getQuestionInfo = async (questionId: string) => {
  console.log(`getQuestionInfo: ${questionId}...`)

  let ans = {}

  const [questionHref, questionLogHref] = [getQuestionHref(questionId), getQuestionLogHref(questionId)]
  console.log(`questionHref, questionLogHref, ${questionHref}, ${questionLogHref}`)

  const questionInfo = (await axios.get<QuestionInfo>(questionHref)).data
  const questionLogHTML = (await axios.get<string>(questionLogHref, {
    headers: {
      Cookie: loggedCookie
    }
  })).data
  const questionLogDOMQuerySelector = cheerio.load(questionLogHTML)
  const lastQuestionLog = questionLogDOMQuerySelector('#zh-question-log-list-wrap>:last-child')
  const lastQuestionLogATag = lastQuestionLog.find('a')
  const lastQuestionLogTime = lastQuestionLog.find('time')

  const userName = lastQuestionLogATag.text()
  const userUrl = lastQuestionLogATag.attr()?.href
  const questionLogFirstTime = lastQuestionLogTime.text()

  console.log(`userName, userUrl: ${userName}, ${userUrl}`)
  if (userName === '匿名用户' || userName === '「已注销」' || !userUrl) {
    ans = {
      questionInfo,
      questionLogFirstTime,
      questionLogFirstPeople: userName,
      questionLogFirstPeopleURL: userUrl
    }
  } else {
    ans = {
      questionInfo,
      questionLogFirstTime,
      questionLogFirstPeopleURL: userUrl,
      questionLogFirstPeople: await getUserInfo(userUrl)
    }
  }

  return ans
}

const processSearchData = async (searchData: SearchData) => {
  console.log('processing searchData', searchData)
  for (const datum of searchData.data) {
    // 只需要搜索结果中的问答的答案
    if (datum.type === 'search_result' && datum.object?.type === 'question' && datum.object.id) {
      const qid = datum.object.id
      // 找到这个回答对应的问题
      const questionsArray = db.getObjectSafe<string[]>(`/search/${defaultKeyword}/questionId`)
      if (questionsArray?.includes(qid)) continue

      db.push(`/search/${defaultKeyword}/questionId[]`, qid, true)
      db.push(`/search/${defaultKeyword}/questionInfo/${qid}`, await getQuestionInfo(qid), true)
    }
  }
}

const getSearchResults = async () => {
  // 从上次中断的地方继续开始
  const lastTimeNextAPIHref = db.getObjectSafe<string>(`/search/${defaultKeyword}/nextAPIHref`)
  if (lastTimeNextAPIHref === '') {
    console.log('上次已经全部爬取完了')
    return
  }
  let apiHref = lastTimeNextAPIHref || getSearchBeginHref()
  let searchData: SearchData
  do {
    const apiUrlParams = new URL(apiHref).searchParams
    console.log(`fetching question with offset=${String(apiUrlParams.get('offset'))}, q=${String(apiUrlParams.get('q'))}`)
    const searchDataResponse = await axios.get<SearchData>(apiHref, {
      headers: {
        ...defaultHeaders,
        [encryptHeaderKey]: encrypt(
          getEncryptSource(
            getEncryptSourceV(),
            getEncryptSourceT(apiHref),
            getEncryptSourceG()
          )
        )
      },
      proxy: {
        host: '127.0.0.1',
        port: 8888
      }
    })
    searchData = searchDataResponse.data
    db.push(`/search/${defaultKeyword}/currentAPIHref`, apiHref, true)
    db.push(`/search/${defaultKeyword}/nextAPIHref`, searchData.paging.next, true)
    await processSearchData(searchData)
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
    apiHref = searchData.paging.next
  } while (!searchData.paging.is_end)
}

// 执行爬取任务
getSearchResults().then(() => {
  console.log('爬取完成')
}).catch(console.error)

// console.log('process.env.NODE_ENV', process.env.NODE_ENV)
// 无限等待，防止 log 变量在 Chrome devtools 里面消失，方便调试
if (process.env.NODE_ENV === 'development') {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 10000000)
  }).catch(() => {})
}
