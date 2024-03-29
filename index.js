import { Server } from 'socket.io'
const port = 8000
const io = new Server(port, {
  cors: {
    origin: '*'
  }
})
console.log(`Server running on port ${port}`)

import user from './user.js'
const {
  login,
  getAllUser,
  verifyPro,
  serverjoin,
  serverleave,
  servercheck,
  serverleaveAll,
  addPro
} = user(io)
import knex from './db.js'
const onConnection = (socket) => {
  try {
    console.log('new ', socket.id)
    socket.on('user:login', login)
    socket.on('user:getAllUser', getAllUser)
    socket.on('user:verifyPro', verifyPro)
    socket.on('server:join', serverjoin)
    socket.on('server:leave', serverleave)
    socket.on('server:check', servercheck)
    socket.on('pay', (data) => {
      console.log('pay', data)
      knex('order').insert({
        payid:data.payid,
        socketid:data.id,
        user:JSON.stringify(data.userme),
        social_uid:data.social_uid,
        created_at:new Date(),
        updated_at:new Date()
      }).then((data) => {console.log('insert', data)})
    })
    const allSockets = io.sockets.sockets.size
    io.emit('user:allUser', allSockets)
    socket.on('disconnect', (reason) => {
      console.log('disconnect', reason, 'socket ', socket.id)
      const allSockets = io.sockets.sockets.size
      io.emit('user:allUser', allSockets)
      serverleaveAll({ socket_id: socket.id })
    })
  } catch (error) {
    console.log('error', error)
  }
}

io.on('connection', onConnection)


import express from 'express'
let app = express()
import bodyParser from 'body-parser'
app.use(bodyParser.json());
// 当对主页发出 GET 请求时，响应“hello world”
app.get('/', function (req, res) {
  res.send('hello')
})

// POST method route
app.post('/pay', function (req, res) {
  console.log(req.body)
  let pay = req.body.data.order
  let {custom_order_id,total_amount} = pay
  if(!custom_order_id || !total_amount){
    res.send({"ec":200,"em":""})
    return
  }
  //从数据库中查询订单
  knex('order').where('payid',custom_order_id).then((data)=>{
    console.log('data',data)
    if(data.length>0){
      //订单存在
      let order = data[0]
      
      addPro({
        custom_order_id:custom_order_id,
        count:total_amount,
        pay:pay,
        order:order,
        social_uid:order.social_uid
      })
    }else{
      //订单不存在
      console.log('订单不存在')
    }
  })
  res.send({"ec":200,"em":""})
})
//启动成功
app.listen(8001, function () {
  console.log('pay app listening on port 8001!')
})