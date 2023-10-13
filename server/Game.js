import Player from './Player.js'
import { Server } from 'socket.io'
import settings from './settings.js'

export default class Game {
  clients = {}
  outClients = {}
  room1 = 'room1'


  constructor() {
    this.startSocketIO()
  }

  /**
   *
   * @param key
   * @param value {Player}
   */
  addClient({ key, value }) {
    this.clients[key] = value
    this.outClients[key] = value.print()
  }

  deleteClient(key) {
    delete this.clients[key]
    delete this.outClients[key]
  }

  startSocketIO() {
    const io = new Server(3000, {
      cors: {
        origin: '*'
      }
    })

    io.on('connect', socket => {

      socket.once('join', user_name => {
        // 为新连接的客户端创建一个坦克
        const player = new Player({
          id: socket.id,
          user_name
        })
        this.addClient({
          key: socket.id,
          value: player
        })
        socket.join(this.room1)
        io.to(this.room1).emit('updateTanks', this.outClients)
      })

      socket.on('disconnect', () => {
        this.deleteClient(socket.id)
        socket.to(this.room1).emit('updateTanks', this.outClients)
      })
      const tankConfig = settings.tank_config
      socket.on('moveTank', args => {
        console.log('moveTank', args)

        for (let i = 0; i < tankConfig.step_speed; i++) {

          let x = this.clients[socket.id].tank_status.x
          let y = this.clients[socket.id].tank_status.y
          if ('ArrowLeft' === args) {
            x = x - tankConfig.step_size
          }
          if ('ArrowRight' === args) {
            x = x + tankConfig.step_size
          }
          if ('ArrowUp' === args) {
            y = y - tankConfig.step_size
          }
          if ('ArrowDown' === args) {
            y = y + tankConfig.step_size
          }

          this.clients[socket.id].tank_status.x = x
          this.clients[socket.id].tank_status.y = y
          this.outClients[socket.id] = this.clients[socket.id].print()
          io.to(this.room1).emit('updateTanks', this.outClients)
        }
      })
    })
  }
}
