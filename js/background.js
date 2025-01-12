const hostUrl = 'http://122.51.248.81:3000'
// const hostUrl = 'http://localhost:3000'

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // 用户登录
  if (request.type === 'login') {
    axios.post(hostUrl + '/users/login', request.payload)
      .then(function (response) {
        sendResponse(response)
        chrome.storage.sync.set({ user: response.data, token: response.data.token }, function() {
        })
      })
      .catch(function (error) {
      })
      return true // keeps the message channel open until `sendResponse` is executed
  }

  // 用户注册
  if (request.type === 'register') {
    axios.post(hostUrl + '/users/register', request.payload)
      .then(function (response) {
        sendResponse(response)
      })
      .catch(function (error) {
      })
      return true // keeps the message channel open until `sendResponse` is executed
  }

  // 追番请求
  if (request.type === 'favorite') {
    axios({
      method: 'post',
      url: hostUrl + '/favorite/set', 
      data: request.payload,
      headers: {
        authorization: request.payload.token
      }
    })
    .then(function (response) {
      sendResponse(response)
    })
    .catch(function (error) {
    })
    return true // keeps the message channel open until `sendResponse` is executed
  }

  // 取消追番
  if (request.type === 'cancleFavorite') {
    axios({
      method: 'post',
      url: hostUrl + '/favorite/cancle', 
      data: request.payload,
      headers: {
        authorization: request.payload.token
      }
    })
    .then(function (response) {
      sendResponse(response)
    })
    .catch(function (error) {
    })
    return true // keeps the message channel open until `sendResponse` is executed
  }

  // 我的追番列表
  if (request.type === 'myFavorite') {
    axios({
      method: 'post',
      url: hostUrl + '/favorite/list', 
      data: request.payload,
      headers: {
        authorization: request.payload.token
      }
    })
    .then(function (response) {
      sendResponse(response)
    })
    .catch(function (error) {
    })
    return true // keeps the message channel open until `sendResponse` is executed
  }

  // 我的追番历史
  if (request.type === 'myHistory') {
    axios({
      method: 'post',
      url: hostUrl + '/history/list', 
      data: request.payload,
      headers: {
        authorization: request.payload.token
      }
    })
    .then(function (response) {
      sendResponse(response)
    })
    .catch(function (error) {
    })

    return true // keeps the message channel open until `sendResponse` is executed
  }

  // 检查是否已追番
  if (request.type === 'checkFavorite') {
    axios({
      method: 'post',
      url: hostUrl + '/favorite/check', 
      data: request.payload,
      headers: {
        authorization: request.payload.token
      }
    })
    .then(function (response) {
      sendResponse(response)
    })
    .catch(function (error) {
    })
    return true // keeps the message channel open until `sendResponse` is executed
  }

  // 检查是否已追番
  if (request.type === 'checkFavorite2') {
    axios({
      method: 'post',
      url: hostUrl + '/favorite/check', 
      data: request.payload,
      headers: {
        authorization: request.payload.token
      }
    })
    .then(function (response) {
      sendResponse(response)
    })
    .catch(function (error) {
    })
    return true // keeps the message channel open until `sendResponse` is executed
  }
})

// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
  let url, fanid, lastPos, lastTime, cover, name, other
  port.onMessage.addListener(function(msg) {
    if (msg.method === 'close') {
      url = msg.href
      fanid = msg.href.substr(msg.href.indexOf('play/') + 5)
      fanid = fanid.substr(0, fanid.indexOf('?playid'))
      lastPos = msg.lastPos
      cover = msg.cover
      name = msg.name
      other = msg.other
    }
  })

  port.onDisconnect.addListener(function(msg) {
    chrome.storage.sync.get({ user: null, token: null, lastTime: null }, function(items) {
      if (items.token) {
        if (url.indexOf('playid') > -1) {
          if (url.indexOf('lastTime') > -1) {
            url = url.substr(0, url.indexOf('lastTime'))
          }
          const params = {
            userId: items.user.data.id,
            fanId: fanid,
            lastUrl: url,
            lastTime: items.lastTime || '00:00',
            lastPos: lastPos,
            cover: cover,
            name: name,
            other: other
          }

          // 新增历史
          axios({
            method: 'post',
            url: hostUrl + '/history/create', 
            data: params,
            headers: {
              authorization: items.token
            }
          })
          .then(function (response) {
            sendResponse(response)
          })
          .catch(function (error) {
          })

          // 更新追番
          axios({
            method: 'post',
            url: hostUrl + '/favorite/update', 
            data: params,
            headers: {
              authorization: items.token
            }
          })
          .then(function (response) {
            sendResponse(response)
          })
          .catch(function (error) {
          })
        }
      }
    })
  })
})

