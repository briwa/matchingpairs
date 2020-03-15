import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class CreditsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'CreditsScene', active: false })
  }

  private static readonly TWEMOJI_LICENSE = 'Twemoji graphics made by Twitter and other contributors,'
    + '\nlicensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/'

  create () {
    const bgZone = this.add.zone(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      .setOrigin(0, 0)

    const heroWidth = CANVAS_WIDTH / 1.5
    const heroHeight = CANVAS_HEIGHT / 1.5
    const logoHeight = 240

    const cont = this.add.container(0, 0)
    const heroCont = this.add.zone(0, 0, heroWidth, heroHeight)
      .setOrigin(0, 0)
    const logoCont = this.add.zone(0, 0, heroWidth, logoHeight)
      .setOrigin(0, 0)
    const title = this.add.text(0, 0, 'Credits', {
      fontFamily: 'Maven Pro',
      fontSize: '40px',
      align: 'center',
      fill: '#000000'
    })

    const twemojiLicense = CreditsScene.TWEMOJI_LICENSE
    const twemojiText = this.add.text(0, 0, twemojiLicense, {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      align: 'left',
      fill: '#000000'
    })

    cont.add([heroCont, logoCont, title, twemojiText])

    const zone = this.add.zone(
      CANVAS_WIDTH / 2 - (heroWidth / 2),
      CANVAS_HEIGHT / 2 - (heroHeight / 2),
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    Phaser.Display.Align.In.Center(cont, zone)
    Phaser.Display.Align.In.Center(title, logoCont)
    Phaser.Display.Align.In.Center(twemojiText, logoCont, 0, 40)

    const footerText = this.add.text(0, 0, 'Tap to go back.', {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      align: 'center',
      fill: '#000000'
    }).setInteractive()

    footerText.on('pointerdown', () => {
      this.scene.switch('HomeScene')
    })

    Phaser.Display.Align.In.BottomCenter(footerText, bgZone)
  }
}
