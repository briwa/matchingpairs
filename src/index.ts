import Phaser from 'phaser'

import MainScene from './scenes/main'

class Game extends Phaser.Game {
  constructor () {
    super({
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 480,
        height: 640
      },
      scene: [
        MainScene
      ]
    })
  }
}

new Game()
