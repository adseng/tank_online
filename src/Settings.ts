class Settings {
    stage_width: number = window.innerWidth
    stage_height: number = window.innerHeight
    background_layer = {
        fill: '#92ba92'
    }

    socket_url = 'ws://localhost:3000'

    constructor() {
    }
}

export const settings = new Settings()
