import Phaser from 'phaser'

import HomeScene from './scenes/home'
import GameScene from './scenes/game'
import UIScene from './scenes/game/ui'
import ModalScene from './scenes/modal'

import { CANVAS_WIDTH, CANVAS_HEIGHT } from './helpers/constants'

class Game extends Phaser.Game {
  constructor () {
    super({
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT
      },
      scene: [
        HomeScene,
        GameScene,
        UIScene,
        ModalScene
      ],
      backgroundColor: '#ffffff'
    })
  }
}

new Game()
