import Phaser from 'phaser'
import Button from '../objects/button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class HomeScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HomeScene' })
  }

  preload () {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
  }

  create () {
    ;(window as any).WebFont.load({
      custom: {
        families: [ 'Fredoka One', 'Didact Gothic' ]
      },
      active: () => {
        const heroWidth = CANVAS_WIDTH / 1.5
        const heroHeight = CANVAS_HEIGHT / 1.5
        const logoHeight = 240

        const cont = this.add.container(0, 0)
        const heroCont = this.add.rectangle(0, 0, heroWidth, heroHeight, 0xff0000)
          .setOrigin(0, 0)
        const logoCont = this.add.rectangle(0, 0, heroWidth, logoHeight, 0xffff00)
          .setOrigin(0, 0)
        const title = this.add.text(0, 0, 'Matching\nPairs', {
          fontFamily: 'Fredoka One',
          fontSize: '60px',
          align: 'center',
          fill: '#000000'
        })
        const button = new Button({
          scene: this,
          label: 'play',
          variant: 'primary',
          size: 'lg'
        })
        cont.add([heroCont, logoCont, title, button])

        const zone = this.add.zone(
          CANVAS_WIDTH / 2 - (heroWidth / 2),
          CANVAS_HEIGHT / 2 - (heroHeight / 2),
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        )

        Phaser.Display.Align.In.Center(cont, zone)
        Phaser.Display.Align.In.Center(button, logoCont, -button.width / 2, (logoHeight / 2) + 20)
        Phaser.Display.Align.In.Center(title, logoCont)

        button.on('pointerdown', () => {
          this.scene.setActive(false, 'HomeScene')
          this.scene.setActive(true, 'GameScene')
          this.scene.switch('GameScene')
        })
      }
    })
  }
}
