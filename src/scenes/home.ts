import Phaser from 'phaser'
import Button from '../objects/button'
import WebFont from 'webfontloader'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class HomeScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HomeScene', active: true })
  }

  create () {
    WebFont.load({
      custom: {
        families: ['Squada One', 'Maven Pro']
      },
      active: this.onLoaded.bind(this)
    })
  }

  private onLoaded () {
    const heroWidth = CANVAS_WIDTH / 1.5
    const heroHeight = CANVAS_HEIGHT / 1.5
    const logoHeight = 240

    const cont = this.add.container(0, 0)
    const heroCont = this.add.zone(0, 0, heroWidth, heroHeight)
      .setOrigin(0, 0)
    const logoCont = this.add.zone(0, 0, heroWidth, logoHeight)
      .setOrigin(0, 0)
    const title = this.add.text(0, 0, 'Matching\nPairs!', {
      fontFamily: 'Squada One',
      fontSize: '100px',
      align: 'center',
      fill: '#000000'
    })
    const playButton = new Button({
      scene: this,
      label: 'play',
      variant: 'primary',
      size: 'lg'
    })

    cont.add([heroCont, logoCont, title, playButton])

    const zone = this.add.zone(
      CANVAS_WIDTH / 2 - (heroWidth / 2),
      CANVAS_HEIGHT / 2 - (heroHeight / 2),
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    Phaser.Display.Align.In.Center(cont, zone)
    Phaser.Display.Align.In.Center(playButton, logoCont, -playButton.width / 2, (logoHeight / 2) + 20)
    Phaser.Display.Align.In.Center(title, logoCont)

    playButton.on('pointerdown', () => {
      this.scene.switch('GameScene')
    })
  }
}
