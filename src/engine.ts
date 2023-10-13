import Konva from 'konva'
import { io } from 'socket.io-client'
import { TankStatus } from './type.ts'

// 欢迎页面
export function welcome() {

}


export function startGame() {
  const stage = new Konva.Stage({
    container: 'app',
    width: window.innerWidth,
    height: window.innerHeight
  })

  const layerTanks = new Konva.Layer({ listening: false })
  const layerGame = new Konva.Layer({ listening: false })
  stage.add(layerGame)
  stage.add(layerTanks)


  const layerBackground = new Konva.Rect({
    width: layerGame.width(),
    height: layerGame.height(),
    fill: '#92ba92'
  })
  const gameDesp = new Konva.Text({
    text: '按上下左右键移动',
    fontSize: 40
  })

// const gameConfig = new Konva.Group();
// layer.add(gameConfig)

  layerGame.add(layerBackground)
  layerGame.add(gameDesp)

  const circleConfig = {
    radius: 10
  }


  let keys: Record<any, any> = {
    space: false
  }
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true
  })

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false
  })

  const fps = 20
  let lastTime = 0

  function loop(time: number) {
    requestAnimationFrame(loop)
    if (time - lastTime < 1000 / fps) {
      return
    }
    // let realFPS = 1000 / (time - lastTime)
    // console.log('real fps', realFPS)
    // do something
    move()
    lastTime = time
  }

  requestAnimationFrame(loop)

  const socket = io('ws://192.180.3.41:3000', {
    transports: ['websocket'],
    upgrade: false
  })
  socket.on('connect', () => {
    socket.emit('init', {
        x: +Math.random().toFixed(1),
        y: +Math.random().toFixed(1),
        fill: Konva.Util.getRandomColor()
      }
    )
  })

  socket.on('updateTanks', (args: { id: number, tankStatus: TankStatus }[]) => {
    layerTanks.destroyChildren()

    for (let tankConfig of Object.values(args)) {

      const circle1 = new Konva.Circle({
        radius: circleConfig.radius,
        fill: tankConfig.tankStatus.fill,
        x: layerTanks.width() * tankConfig.tankStatus.x,
        y: layerTanks.height() * tankConfig.tankStatus.y
      })
      layerTanks.add(circle1)
    }
  })

  function move() {

    if (keys['ArrowLeft']) {
      socket.emit('moveTank', 'ArrowLeft')
    }
    if (keys['ArrowRight']) {
      socket.emit('moveTank', 'ArrowRight')
    }
    if (keys['ArrowUp']) {
      socket.emit('moveTank', 'ArrowUp')
    }
    if (keys['ArrowDown']) {
      socket.emit('moveTank', 'ArrowDown')
    }
  }
}






