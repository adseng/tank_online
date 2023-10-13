import settings from './settings.js'

export default class Player {
  id
  user_name
  tank_status
  direction

  constructor({ id, user_name }) {
    this.id = id
    this.user_name = user_name
    this.tank_status = {
      radius: settings.tank_config.circle_radius,
      x: +Math.random().toFixed(1),
      y: +Math.random().toFixed(1),
      fill: settings.tank_config.fill(),
      direction: 'up'
    }
  }

  print() {
    return {
      id: this.id,
      user_name: this.user_name,
      tank_status: this.tank_status,
      direction: this.direction
    }
  }
}
