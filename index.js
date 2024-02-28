import { Server } from 'socket.io'
const port = 8000
const io = new Server(port, {
  cors: {
    origin: '*'
  }
})
console.log(`Server running on port ${port}`)

import user from './user.js'
const { login, getAllUser, verifyPro, serverjoin, serverleave, servercheck } =
  user(io)

const onConnection = (socket) => {
  console.log('new ', socket.id)
  socket.on('user:login', login)
  socket.on('user:getAllUser', getAllUser)
  socket.on('user:verifyPro', verifyPro)
  socket.on('server:join', serverjoin)
  socket.on('server:leave', serverleave)
  socket.on('server:check', servercheck)
  const allSockets = io.sockets.sockets.size
  socket.emit('user:allUser', allSockets)
}

io.on('connection', onConnection)
io.on('disconnect', (socket) => {
  console.log('disconnect ', socket.id)
  const allSockets = io.sockets.sockets.size
  socket.emit('user:allUser', allSockets)
})
