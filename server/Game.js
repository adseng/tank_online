import Player from './Player.js'
import { Server } from 'socket.io'
import settings from './settings.js'
import { checkCollision } from './utils.js'

export default class Game {
  clients = {}
  room1 = 'room1'
  io


  constructor() {
    this.startSocketIO()
    this.loop()
  }

  /**
   *
   * @param key
   * @param value {Player}
   */
  addClient({ key, value }) {
    this.clients[key] = value
  }

  deleteClient(key) {
    delete this.clients[key]
  }

  startSocketIO() {
    this.io = new Server(3000, {
      cors: {
        origin: '*'
      }
    })

    this.io.on('connect', socket => {

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
      })

      socket.on('disconnect', () => {
        this.deleteClient(socket.id)
      })

      let lastTime = 0
      const timeDiff = 1000 / settings.game_config.fps
      socket.on('moveTank', args => {
        console.log('moveTank', args)

        // 控制逻辑帧率
        const nowTime = Date.now()
        if (nowTime - lastTime < timeDiff) {
          return
        }
        lastTime = nowTime

        this.clients[socket.id]?.moveTank(args)
      })

      socket.on('shut', args => {
        console.log('shut')
        const player = this.clients[socket.id]
        player.createBullet()
      })
    })
  }

  loop() {
    // 渲染帧率
    setInterval(() => {
      this.hit()
      let out = {}
      for (let clientKey in this.clients) {

        this.clients[clientKey].updateBullet()
        out[clientKey] = this.clients[clientKey].print()
      }
      this.io.to(this.room1).emit('updateTanks', out)
    }, 1000 / settings.game_config.fps)
  }

  hit() {
    let hitO = []
    const keys = Object.keys(this.clients)
    for (let i = 0; i < keys.length-1; i++) {
      let o1 = this.clients[keys[i]].tank_status
      let b1 = this.clients[keys[i]].bullet_status
      for (let j = i+1; j < keys.length; j++) {
        let o2 = this.clients[keys[j]].tank_status
        let b2 = this.clients[keys[j]].bullet_status
        if (o1 && b2 && checkCollision({x: o1.x, y: o1.y, radius: o1.radius}, {x: b2.x, y: b2.y, radius: b2.radius})) {
          hitO.push({[keys[i]]: 'tank_status'})
          hitO.push({[keys[j]]: 'bullet_status'})
        }
        if (b1 && b2 && checkCollision({x: b1.x, y: b1.y, radius: b1.radius}, {x: b2.x, y: b2.y, radius: b2.radius})) {
          hitO.push({[keys[i]]: 'bullet_status'})
          hitO.push({[keys[j]]: 'bullet_status'})
        }
        if (b1 && o2 && checkCollision({x: b1.x, y: b1.y, radius: b1.radius}, {x: o2.x, y: o2.y, radius: o2.radius})) {
          hitO.push({[keys[i]]: 'bullet_status'})
          hitO.push({[keys[j]]: 'tank_status'})
        }
        if (o1 && o2 && checkCollision({x: o1.x, y: o1.y, radius: o1.radius}, {x: o2.x, y: o2.y, radius: o2.radius})) {
          hitO.push({[keys[i]]: 'tank_status'})
          hitO.push({[keys[j]]: 'tank_status'})
        }

      }
    }

    for (let hitVa of hitO) {
      for (const hitVaKey in hitVa) {

        if (hitVa[hitVaKey] === 'tank_status' && this.clients[hitVaKey]) {
           this.clients[hitVaKey].tank_status = null
        }
        if (hitVa[hitVaKey] === 'bullet_status' && this.clients[hitVaKey]) {
          this.clients[hitVaKey].bullet_status = null
        }
      }
    }
  }
}


