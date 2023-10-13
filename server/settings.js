import { getRandomColorRGB } from './utils.js'

export default {
  tank_config: {
    circle_radius: 10,
    step_size: 0.01,
    step_speed: 1,
    fill: () => getRandomColorRGB()
  }
}
