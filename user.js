import knex from './db.js'
import cardInc from './card.js'

export default (io) => {
  const send = function (socket, event, data) {
    socket.emit(event, data)
    console.log('send', event, data)
  }
  /**
   * 登录落地
   * @param {*} payload
   * @returns
   */
  const login = function (payload) {
    // {
    //   access_token: 'E9F55DF1648851CFCAAFB2C7EA1F1C5C',
    //   code: 0,
    //   faceimg: 'https://thirdqq.qlogo.cn/ek_qqapp/AQBcJqkcicrHkpialorkoHtp1CoibJNNg4Mlv6hHIADaxcYkXyEAokI9KqGjMsGW6efCsdwGlbSUfYYc9mU3xzthhuUa9NcmvlbFowWISD7U2pqXpA856jA1CJPKcsmUQ/100',
    //   gender: '男',
    //   ip: '113.249.165.105',
    //   location: null,
    //   msg: 'succ',
    //   nickname: 'www.',
    //   social_uid: '1A02475C9F940948E48D6FDB66F4836E',
    //   type: 'qq',
    //   isPro: false
    // }
    const socket = this // hence the 'function' above, as an arrow function will not work
    console.log('login infomation', payload)
    const { social_uid, type } = payload
    if (!social_uid || !type) {
      console.log('login infomation error')
      send(socket, 'user:login', {
        status: false,
        message: 'login infomation error'
      })
      return
    }
    const user = knex('user').where({ social_uid: social_uid, type: type })
    user.then((data) => {
      if (data.length > 0) {
        console.log('user exist', data)
        let outtime = new Date(parseInt(data[0].outtime))
        //if outtime is less than now, user is not a pro
        if(data[0].isPro){
          console.log('user is pro')
          if (outtime < new Date()) {
            send(socket, 'user:login', {
              isPro: false,
              outTime: data[0].outtime,
              status: true,
              message: '你的Pro会员已过期'
            })
          } else {
            send(socket, 'user:login', {
              isPro: data[0].isPro,
              outTime: data[0].outtime,
              status: true,
              message: '你是个PRO会员'
            })
          }
        }else{
          //不是pro
          send(socket, 'user:login', {
            isPro: data[0].isPro,
            outTime: data[0].outtime,
            status: true,
            message: '你不是Pro会员'
          })
        }
        
      } else {
        console.log('user not exist')
        // insert user by payload
        insertUser(socket, payload)
      }
    })
  }
  /**
   * 添加用户
   * @param {*} payload
   */
  const insertUser = function (socket, payload) {
    const {
      access_token,
      code,
      faceimg,
      gender,
      ip,
      location,
      msg,
      nickname,
      isPro,
      outtime,
      social_uid,
      type
    } = payload
    knex('user')
      .insert({
        access_token: access_token,
        code: code,
        faceimg: faceimg,
        gender,
        ip: ip,
        location: location,
        msg: msg,
        nickname: nickname,
        social_uid: social_uid,
        type: type,
        isPro: isPro,
        outtime: outtime ? outtime : ''
      })
      .then((data) => {
        console.log('insert user success', data)
        send(socket, 'user:login', {
          isPro: isPro,
          outTime: outtime,
          status: true,
          message: 'You are a pro'
        })
      })
      .catch((err) => {
        console.log('insert user error', err)
      })
  }
  /**
   * 获取所有在线用户
   */
  const getAllUser = function () {
    console.log('get all user')
    const socket = this // hence the 'function' above, as an arrow function will not work
    //send all socket count
    const allSockets = io.sockets.sockets.size
    socket.emit('user:allUser', allSockets)
  }
  /**
   * 验证Pro
   * @param {*} payload
   * @returns
   */
  const verifyPro = function (payload) {
    console.log('revd user:verifyPro', payload)
    const socket = this // hence the 'function' above, as an arrow function will not work
    const { social_uid, type, card } = payload
    if (!social_uid || !type || !card) {
      console.log('verifyPro infomation error')
      send(socket, 'user:verifyPro', {
        status: false,
        message: 'verifyPro infomation error'
      })
      return
    }
    //verify card is exist in card array

    let cardindex = cardInc.findIndex((item) => item === card)
    if (cardindex != -1) {
      //update user isPro and outtime
      knex('user')
        .where({ social_uid, type })
        .update({
          isPro: true,
          outtime: new Date().setMonth(new Date().getMonth() + 1)
        })
        .then((data) => {
          console.log('update user success', data)
          send(socket, 'user:verifyPro', {
            status: true,
            message: '恭喜你成为Pro会员'
          })
        })
        .catch((err) => {
          console.log('update user error', err)
        })
    } else {
      send(socket, 'user:verifyPro', {
        status: false,
        message: '验证密钥失败~'
      })
    }
  }
  let serverList = {}
  /**
   * 加入服务器
   * @param {*} payload
   */
  const serverjoin = function (payload) {
    console.log('serverjoin ', payload)
    const { server, socket_id } = payload
    if (!serverList[server]) {
      serverList[server] = []
    }
    if (serverList[server].findIndex((item) => item === socket_id) === -1) {
      serverList[server].push(socket_id)
    }
  }
  /**
   * 退出服务器
   * @param {*} payload
   */
  const serverleave = function (payload) {
    console.log('serverleave ', payload)
    const { server, socket_id } = payload
    if (serverList[server]) {
      let index = serverList[server].findIndex((item) => item === socket_id)
      if (index !== -1) {
        serverList[server].splice(index, 1)
      }
    }
  }
  /**
   * 服务器获取在线人数
   * @param {*} payload
   * @param {*} callback
   */
  const servercheck = function (payload, callback) {
    const server = payload.server
    if (serverList[server]) {
      console.log('server ', serverList[server])
      callback({
        server: server,
        count: serverList[server].length
      })
    } else {
      callback({
        server: server,
        count: 0
      })
    }
  }
  const serverleaveAll = function (payload) {
    const { socket_id } = payload
    for (let key in serverList) {
      let index = serverList[key].findIndex((item) => item === socket_id)
      if (index !== -1) {
        serverList[key].splice(index, 1)
      }
    }
  }

  return {
    login,
    getAllUser,
    verifyPro,
    serverjoin,
    serverleave,
    servercheck,
    serverleaveAll
  }
}
