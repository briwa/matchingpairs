import Phaser from 'phaser'

import HomeScene from './scenes/home'
import CreditsScene from './scenes/credits'
import GameScene from './scenes/game'
import UIScene from './scenes/game/ui'
import ModalGenericScene from './scenes/modals/generic'

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
        CreditsScene,
        GameScene,
        UIScene,
        ModalGenericScene
      ],
      backgroundColor: '#ffffff'
    })
  }
}

new Game()
