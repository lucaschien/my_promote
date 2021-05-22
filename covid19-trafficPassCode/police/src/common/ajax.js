
const request = (method, url, data, config = {}) => {
  let options = Object.assign({}, config, {
    url,
    method,
    data
  })
  options.headers = Object.assign({}, options.headers, {
    'X-Requested-With': 'XMLHttpRequest',
    // 'X-ACCOUNT': window.accountKey,
    // 'X-CHATBOT': window.chatBotKey
  })
  return new Promise((resolve, reject) => {
    window.axios
      .request(options)
      .then(function (res) {
        let data = res.data
        if (!data) {
          return resolve(res)
        }
        if (data.HasError) {
          if (!res.config.notNotifyError) {}
          reject(res)
        }
        resolve(data)
      })
      .catch(res => {
        if (!res.response) {
          let error = {}
          return reject(error)
        }
        if (res.response.status === 417) {
          // popDialog.alert('系统错误')
        }
        reject(res.response)
      })
  })
}

export const ajax = {
  get (url, config) {
    return request('get', url, null, config)
  },
  delete (url, data, config) {
    return request('delete', url, data, config)
  },
  head (url, config) {
    return request('head', url, null, config)
  },
  post (url, data, config) {
    return request('post', url, data, config)
  },
  put (url, data, config) {
    return request('put', url, data, config)
  },
  patch (url, data, config) {
    return request('path', url, data, config)
  },
  setCommonHeader (key, value) {
    window.axios.defaults.headers.common[key] = value
  },
  checkErrorCode (backCode, checkCode='996600001') {
    return backCode === checkCode
  },
}
