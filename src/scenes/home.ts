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
    const logoHeight = 200

    const bgZone = this.add.zone(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      .setOrigin(0, 0)
    const titleZone = this.add.zone(
      CANVAS_WIDTH / 2 - (heroWidth / 2),
      CANVAS_HEIGHT / 2 - (heroHeight / 2),
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

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

    const footerText = this.add.text(0, 0, 'Made by Briwa. Tap to see credits.', {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      align: 'center',
      fill: '#000000'
    }).setInteractive()

    playButton.on('pointerdown', () => {
      this.scene.setActive(false, 'HomeScene')
      this.scene.setActive(true, 'GameScene')
      this.scene.switch('GameScene')
    })

    footerText.on('pointerdown', () => {
      this.scene.switch('CreditsScene')
    })

    cont.add([heroCont, logoCont, title, playButton])
    Phaser.Display.Align.In.Center(cont, titleZone)
    Phaser.Display.Align.In.Center(playButton, logoCont, -playButton.width / 2, (logoHeight / 2) + 20)
    Phaser.Display.Align.In.Center(title, logoCont)
    Phaser.Display.Align.In.BottomCenter(footerText, bgZone)
  }
}
