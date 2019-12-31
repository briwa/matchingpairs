import Phaser from 'phaser'

import MainScene from './scenes/main'

class Game extends Phaser.Game {
  constructor () {
    super({
      width: 480,
      height: 640,
      parent: 'app',
      scene: [
        MainScene
      ]
    })
  }
}

new Game()
