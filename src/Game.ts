import Konva from 'konva'
import Stage = Konva.Stage
import { settings } from './Settings.ts'
import Layer = Konva.Layer
import { io, Socket } from 'socket.io-client'
import { Player } from './type.ts'
import Animation = Konva.Animation
import tankImg from './assets/tank1.png'

class Game {
  stage: Stage | undefined
  backgroundLayer: Layer | undefined
  playersLayer: Layer | undefined
  socket: Socket | undefined
  keys: Record<any, any> = {
    space: false
  }
  players: Player[] = []
  imgs: any = {}

  // 游戏帧率
  fps = 200
  timeDiff = 1000 / this.fps
  lastTime = 0
  anim: Animation | undefined

  constructor() {
    this.loop = this.loop.bind(this)
    this.paint = this.paint.bind(this)
    this.loadAsset()

    this.initStage()
    console.log('initStage')

    this.createGameBackgroundLayer()
    console.log('createGameBackgroundLayer')

    this.createGamePlayersLayer()
    console.log('createGamePlayersLayer')

    this.initConnectServer()
    console.log('initConnectServer')
    this.toJoinGame()
    console.log('toJoinGame')


  }

  initStage() {
    this.stage = new Konva.Stage({
      container: 'app',
      width: settings.stage_width,
      height: settings.stage_height
    })
  }

  createGameBackgroundLayer() {
    this.backgroundLayer = new Konva.Layer({ listening: false })
    this.stage!.add(this.backgroundLayer)

    const layerBackground = new Konva.Rect({
      width: this.backgroundLayer.width(),
      height: this.backgroundLayer.height(),
      fill: settings.background_layer.fill
    })
    const gameDesp = new Konva.Text({
      text: '按上下左右键移动，空格发射',
      fontSize: 40,
      fill: settings.background_layer.text_color
    })
    this.backgroundLayer.add(layerBackground)
    this.backgroundLayer.add(gameDesp)
  }

  createGamePlayersLayer() {
    this.playersLayer = new Konva.Layer({ listening: false })
    this.stage!.add(this.playersLayer)
  }

  initConnectServer() {
    this.socket = io(settings.socket_url, {
      transports: ['websocket'],
      upgrade: false
    })

    this.socket.on('updateTanks', (args: Player[]) => {
      this.players = Object.values(args)
      // requestAnimationFrame(this.paint)
    })
  }

  paint() {
    // todo 比例尺
    const size = this.playersLayer!.height() <= this.playersLayer!.width() ? this.playersLayer!.height() : this.playersLayer!.width()
    this.playersLayer!.destroyChildren()
    for (let data of this.players) {
      if (data.tank_status) {
        // const tank = new Konva.Path({
        //   data: settings.shape_path,
        //   fill: data.tank_status.fill,
        //   x: this.playersLayer!.width() * data.tank_status.x,
        //   y: this.playersLayer!.height() * data.tank_status.y,
        //   scaleX: 0.1,
        //   scaleY: 0.1,
        //   rotation: settings.direction_to_rotation[data.tank_status.direction]
        // })

        const groupTank = new Konva.Group()

        const tank = new Konva.Circle({
          fill: data.tank_status.fill,
          x: size * data.tank_status.x,
          y: size * data.tank_status.y,
          radius: size * data.tank_status.radius,
        })
        groupTank.add(tank)
        // 炮管
        const tank_barrel = new Konva.Circle({
          fill: '#000000',
          x: tank.x(),
          y: tank.y(),
          radius: tank.radius() / 4,
          rotation: settings.direction_to_rotation[data.tank_status.direction],
          scaleY: 3,
          scaleX: 0.5
        })

        if (data.tank_status.direction === 'up') {
          tank_barrel.y(tank.y() - tank.radius())
        }
        if (data.tank_status.direction === 'down') {
          tank_barrel.y(tank.y() + tank.radius())
        }
        if (data.tank_status.direction === 'left') {
          tank_barrel.x(tank.x() - tank.radius())
        }
        if (data.tank_status.direction === 'right') {
          tank_barrel.x(tank.x() + tank.radius())
        }
        groupTank.add(tank_barrel)
        // 炮管底座
        const tank_barrel2 = new Konva.Circle({
          fill: 'rgba(54,50,138)',
          x: tank.x(),
          y: tank.y(),
          radius: tank.radius() / 2,
        })
        groupTank.add(tank_barrel2)

        const user_name = new Konva.Text({
          text: data.user_name,
          x: tank.x(),
          y: tank.y(),
          fill: '#fff'
        })
        user_name.offsetX(user_name.width() / 2)
        this.playersLayer!.add(groupTank)
        this.playersLayer!.add(user_name)
      }

      if (data.bullet_status) {
        const bullet = new Konva.Circle({
          radius: size * data.bullet_status.radius,
          fill: data.bullet_status.fill,
          x: size * (data.bullet_status.x),
          y: size * (data.bullet_status.y)
        })
        this.playersLayer!.add(bullet)
      }

    }

  }

  toJoinGame() {
    const input = document.querySelector('.input_username') as HTMLInputElement
    const container = document.querySelector('.container') as HTMLInputElement
    const submit = document.querySelector('.input_button_username') as HTMLButtonElement
    submit!.addEventListener('click', ev => {
      ev.stopPropagation()
      const user_name = input!.value
      // 校验
      const pattern = /^[a-zA-Z\u4E00-\u9FFF]+$/
      if (pattern.test(user_name)) {
        // 输入内容符合要求
        // 执行其他操作...
        input.classList.remove('warning')
        container.style.display = 'none'
        // 加入请求
        this.socket!.emit('join', user_name)
        this.initGameActions()
        this.moveController()
        // requestAnimationFrame(this.loop)
        this.loop()
      } else {
        // 输入内容不符合要求
        // 显示提示或执行其他操作...
        if (!input.classList.contains('warning')) {
          input.classList.add('warning')
        }
        return
      }


    })
  }

  initGameActions() {

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true
    })

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
    })
  }

  moveController() {
    if (this.keys['ArrowLeft']) {
      this.socket!.emit('moveTank', 'ArrowLeft')
    }
    if (this.keys['ArrowRight']) {
      this.socket!.emit('moveTank', 'ArrowRight')
    }
    if (this.keys['ArrowUp']) {
      this.socket!.emit('moveTank', 'ArrowUp')
    }
    if (this.keys['ArrowDown']) {
      this.socket!.emit('moveTank', 'ArrowDown')
    }
    if (this.keys['Space']) {
      this.socket!.emit('shut', '')
    }
  }

  loop() {
    this.anim = new Konva.Animation(frame => {
      if (!frame) return false
      if (frame.time - this.lastTime > this.timeDiff) {
        this.moveController()
        this.lastTime = frame.time
        this.paint()
      } else {
        return false
      }
    }, this.playersLayer)
    this.anim!.start()
  }

  loadAsset() {
    const image = new Image()
    image.src = tankImg
    this.imgs['tank'] = image

  }

}

export default Game
