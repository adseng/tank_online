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
      let lastTime = 0
      const timeDiff = 1000 / settings.game_config.fps
      socket.on('moveTank', args => {
        console.log('moveTank', args)

        // 控制帧率
        const nowTime = Date.now()
        if (nowTime - lastTime < timeDiff) {
          return
        }
        lastTime = nowTime
        try {
          for (let i = 0; i < tankConfig.step_speed; i++) {

            let x = this.clients[socket.id].tank_status.x
            let y = this.clients[socket.id].tank_status.y
            let direction = 'up'
            if ('ArrowLeft' === args) {
              if (x <= 0) return
              x = x - tankConfig.step_size
              direction = 'left'
            }
            if ('ArrowRight' === args) {
              if (x >= 1) return
              x = x + tankConfig.step_size
              direction = 'right'
            }
            if ('ArrowUp' === args) {
              if (y <= 0) return
              y = y - tankConfig.step_size
              direction = 'up'
            }
            if ('ArrowDown' === args) {
              if (y >= 1) return
              y = y + tankConfig.step_size
              direction = 'down'
            }

            this.clients[socket.id].tank_status.x = x
            this.clients[socket.id].tank_status.y = y
            this.clients[socket.id].tank_status.direction = direction
            this.outClients[socket.id] = this.clients[socket.id].print()
            io.to(this.room1).emit('updateTanks', this.outClients)
          }
        } catch (e) {
          console.log(e)
        }
      })
    })
  }
}
