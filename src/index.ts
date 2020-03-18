import Phaser from 'phaser'
import WebFont from 'webfontloader'

import HomeScene from './scenes/home'
import GameScene from './scenes/game'
import UIScene from './scenes/game/ui'
import ModalGenericScene from './scenes/modals/generic'
import ModalSettingsScene from './scenes/modals/settings'
import ModalCreditsScene from './scenes/modals/credits'

export default class Game extends Phaser.Game {
  public static readonly CANVAS_WIDTH = 480
  public static readonly CANVAS_HEIGHT = 640

  constructor () {
    super({
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Game.CANVAS_WIDTH,
        height: Game.CANVAS_HEIGHT
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
