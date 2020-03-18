import Phaser from 'phaser'
import WebFont from 'webfontloader'

import Home from './scenes/home'
import Stage from './scenes/stage'
import UI from './scenes/ui'
import ModalGeneric from './scenes/modals/generic'
import ModalSettings from './scenes/modals/settings'
import ModalCredits from './scenes/modals/credits'

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
        Home,
        Stage,
        UI,
        ModalGeneric,
        ModalSettings,
        ModalCredits
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
