import Phaser from 'phaser'

import MainScene from './scenes/main'

class Game extends Phaser.Game {
  constructor () {
    super({
      width: 800,
      height: 400,
      parent: 'app',
      scene: [
        MainScene
      ]
    })
  }
}

new Game()
