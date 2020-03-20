import Phaser from 'phaser'
import WebFont from 'webfontloader'

import Home from './scenes/home'
import Stage from './scenes/stage'
import UI from './scenes/ui'
import ModalGeneric from './scenes/modals/generic'
import ModalSettings from './scenes/modals/settings'
import ModalCredits from './scenes/modals/credits'

import GameState from './plugins/state'

export default class Game extends Phaser.Game {
  public static readonly CANVAS_WIDTH = 480
  public static readonly CANVAS_HEIGHT = 640

  constructor () {
    super({
      parent: 'app',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Game.CANVAS_WIDTH,
        height: Game.CANVAS_HEIGHT
      },
      plugins: {
        global: [
          { key: 'statePlugin', plugin: GameState, mapping: 'state' }
        ]
      },
      scene: [
        Home,
        Stage,
        UI,
        ModalGeneric,
        ModalSettings,
        ModalCredits
      ],
      transparent: true
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
