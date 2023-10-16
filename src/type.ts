export interface TankStatus {
  x: number
  y: number
  fill: string
  radius: number
  direction: 'left' | 'right' | 'up' | 'down'
}

export interface BulletStatus {
  x: number
  y: number
  fill: string
  radius: number
  direction: 'left' | 'right' | 'up' | 'down'
  long: number
}

export interface Player {
  id: number,
  user_name: string,
  tank_status: TankStatus,
  bullet_status: BulletStatus
}
