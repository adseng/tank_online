// const { Server } = require('socket.io')
// import { Server } from 'socket.io'
// import Player from './Player.js'
// import settings from './settings.js'
//
// const io = new Server(3000, {
//   cors: {
//     origin: '*'
//   }
// })
//
// // 用于存储连接的客户端
// const clients = {}
// const outClients = {}
// const deleteClient = function(key) {
//   delete clients[socket.id]
//   delete outClients[socket.id]
// }
//
// const addClient = key => {
//   clients[socket.id] = {
//     id: socket.id,
//     player: player
//   }
//   outClients[socket.id] = {
//     id: socket.id,
//     player: player.print()
//   }
// }
//
// const tankConfig = {
//   stepSize: 0.01,
//   stepSpeed: 1
// }
//
// const room1 = 'room1'
//
// io.on('connect', socket => {
//
//   socket.once('join', user_name => {
//     // 为新连接的客户端创建一个坦克
//     const player = new Player({
//       id: socket.id,
//       user_name,
//     })
//
//
//     socket.join(room1)
//     io.to(room1).emit('updateTanks', outClients)
//   })
//
//   socket.on('disconnect', () => {
//     deleteClient(socket.id)
//     socket.to(room1).emit('updateTanks', outClients)
//   })
//
//   socket.on('moveTank', args => {
//     console.log('moveTank', args)
//     for (let i = 0; i < tankConfig.stepSpeed; i++) {
//
//       let x = clients[socket.id].tankStatus.x
//       let y = clients[socket.id].tankStatus.y
//       if ('ArrowLeft' === args) {
//         x = x - tankConfig.stepSize
//       }
//       if ('ArrowRight' === args) {
//         x = x + tankConfig.stepSize
//       }
//       if ('ArrowUp' === args) {
//         y = y - tankConfig.stepSize
//       }
//       if ('ArrowDown' === args) {
//         y = y + tankConfig.stepSize
//       }
//
//       clients[socket.id].tankStatus.x = x
//       clients[socket.id].tankStatus.y = y
//       io.to(room1).emit('updateTanks', clients)
//     }
//
//   })
// })

import Game from './Game.js'
new Game()
