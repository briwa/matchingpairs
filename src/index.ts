import Phaser from 'phaser'

import HomeScene from './scenes/home'
import GameScene from './scenes/game'

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
        HomeScene,
        GameScene
      ]
    })
  }
}

new Game()
