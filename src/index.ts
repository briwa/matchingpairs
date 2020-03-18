import Phaser from 'phaser'
import WebFont from 'webfontloader'

import HomeScene from './scenes/home'
import GameScene from './scenes/game'
import UIScene from './scenes/game/ui'
import ModalGenericScene from './scenes/modals/generic'
import ModalSettingsScene from './scenes/modals/settings'
import ModalCreditsScene from './scenes/modals/credits'

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
        ModalGenericScene,
        ModalSettingsScene,
        ModalCreditsScene
      ],
      backgroundColor: '#ffffff'
    })
  }
}

window.addEventListener('load', () => {
  WebFont.load({
    custom: {
      families: ['Squada One', 'Maven Pro']
    },
    active () {
      new Game()
    }
  })
})
