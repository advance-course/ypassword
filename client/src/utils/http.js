import Taro from "@tarojs/taro";

const http = function(url, data) {

  let name = ''
  let $url = ''
  const reg = /(^[a-z]+)\//

  $url = url.replace(/(^[a-z]+)\//,(m,$1,$2)=>{
    name = $1
    return ''
  })

  if(!name) console.warn('url有误，请检查格式！')

  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name,
      data: {
        $url,
        ...data
      }
    }).then((res) => {
      resolve(res.result)
    }).catch((err) => {
      reject(err)
    })
  })
}

export default {
  get(url) {
    return http(url)
  },
  
  post(url, data) {
    return http(url, data)
  }
}
