import settings from './settings.js'

export default class Player {
  id
  user_name
  tank_status
  bullet_status

  constructor({ id, user_name }) {
    this.id = id
    this.user_name = user_name
    this.createTank()
    // this.updateBullet = this.updateBullet.bind(this)
    // this.print = this.print.bind(this)
  }

  createTank() {
    this.tank_status = {
      radius: settings.tank_config.circle_radius,
      x: +Math.random().toFixed(1),
      y: +Math.random().toFixed(1),
      fill: settings.tank_config.fill(),
      direction: 'up'
    }
  }

  moveTank(move_direction) {
    if (!this.tank_status) return
    let x = this.tank_status.x
    let y = this.tank_status.y
    let direction = 'up'
    if ('ArrowLeft' === move_direction) {
      if (x <= 0) return
      x = x - settings.tank_config.step_size
      direction = 'left'
    }
    if ('ArrowRight' === move_direction) {
      if (x >= 1) return
      x = x + settings.tank_config.step_size
      direction = 'right'
    }
    if ('ArrowUp' === move_direction) {
      if (y <= 0) return
      y = y - settings.tank_config.step_size
      direction = 'up'
    }
    if ('ArrowDown' === move_direction) {
      if (y >= 1) return
      y = y + settings.tank_config.step_size
      direction = 'down'
    }
    this.tank_status.x = x
    this.tank_status.y = y
    this.tank_status.direction = direction
  }

  createBullet() {
    // 一次仅存在一发
    if (this.bullet_status) return
    if (!this.tank_status) return
    this.bullet_status = {
      x: this.tank_status.x,
      y: this.tank_status.y,
      radius: settings.bullet_config.circle_radius,
      direction: this.tank_status.direction,
      fill: this.tank_status.fill,
      long: 0
    }

  }

  updateBullet() {
    if (!this.bullet_status) return
    if (this.bullet_status.long > settings.bullet_config.long_max) {
      this.bullet_status = null
      return
    }
    this.bullet_status.long = this.bullet_status.long + settings.bullet_config.step_size

    if (this.bullet_status.direction === 'up') {
      this.bullet_status.y -= settings.bullet_config.step_size
      return
    }
    if (this.bullet_status.direction === 'down') {
      this.bullet_status.y += settings.bullet_config.step_size
      return
    }
    if (this.bullet_status.direction === 'left') {
      this.bullet_status.x -= settings.bullet_config.step_size
      return
    }
    if (this.bullet_status.direction === 'right') {
      this.bullet_status.x += settings.bullet_config.step_size
      return
    }
  }

  print() {
    return {
      id: this.id,
      user_name: this.user_name,
      tank_status: this.tank_status,
      bullet_status: this.bullet_status
    }
  }
}
