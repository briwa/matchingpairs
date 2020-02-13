import Phaser from 'phaser'
import Button from '../objects/button'
import WebFont from 'webfontloader'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class HomeScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HomeScene' })
  }

  create () {
    WebFont.load({
      custom: {
        families: [ 'Fredoka One', 'Didact Gothic' ]
      },
      active: () => {
        const heroWidth = CANVAS_WIDTH / 1.5
        const heroHeight = CANVAS_HEIGHT / 1.5
        const logoHeight = 240

        const cont = this.add.container(0, 0)
        const heroCont = this.add.zone(0, 0, heroWidth, heroHeight)
          .setOrigin(0, 0)
        const logoCont = this.add.zone(0, 0, heroWidth, logoHeight)
          .setOrigin(0, 0)
        const title = this.add.text(0, 0, 'Matching\nPairs', {
          fontFamily: 'Fredoka One',
          fontSize: '60px',
          align: 'center',
          fill: '#ffffff'
        })
        const playButton = new Button({
          scene: this,
          label: 'play',
          variant: 'primary',
          size: 'lg'
        })
        const settingsButton = new Button({
          scene: this,
          label: 'settings',
          variant: 'primary',
          size: 'md'
        })
        cont.add([heroCont, logoCont, title, playButton, settingsButton])

        const zone = this.add.zone(
          CANVAS_WIDTH / 2 - (heroWidth / 2),
          CANVAS_HEIGHT / 2 - (heroHeight / 2),
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        )

        Phaser.Display.Align.In.Center(cont, zone)
        Phaser.Display.Align.In.Center(playButton, logoCont, -playButton.width / 2, (logoHeight / 2) + 20)
        Phaser.Display.Align.In.Center(settingsButton, logoCont, -settingsButton.width / 2, (logoHeight / 2) + 100)
        Phaser.Display.Align.In.Center(title, logoCont)

        playButton.on('pointerdown', () => {
          this.scene.setActive(false, 'HomeScene')
          this.scene.setActive(true, 'GameScene')
          this.scene.switch('GameScene')
        })
      }
    })
  }
}
