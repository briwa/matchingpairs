import Phaser from 'phaser'
import Button from '../objects/button'
import Game from '../index'

const { version: appVersion } = require('../../package.json')

export default class HomeScene extends Phaser.Scene {
  private settings = { size: 4, speed: 1000 }

  constructor () {
    super({ key: 'HomeScene', active: true })
  }

  public create () {
    const heroWidth = Game.CANVAS_WIDTH / 1.5
    const heroHeight = Game.CANVAS_HEIGHT / 1.5
    const logoHeight = 200

    const bgZone = this.add.zone(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT)
      .setOrigin(0, 0)
    const titleZone = this.add.zone(
      Game.CANVAS_WIDTH / 2 - (heroWidth / 2),
      Game.CANVAS_HEIGHT / 2 - (heroHeight / 2),
      Game.CANVAS_WIDTH,
      Game.CANVAS_HEIGHT
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
    const buttonPlay = new Button({
      scene: this,
      label: 'play',
      variant: 'primary',
      size: 'lg'
    })
    const buttonSettings = new Button({
      scene: this,
      label: 'settings',
      variant: 'secondary',
      size: 'md'
    })

    const footerText = this.add.text(0, 0, `v${appVersion} \u00b7 Made by Briwa \u00b7 Tap to see credits.`, {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      align: 'center',
      fill: '#000000'
    }).setInteractive()

    buttonPlay.on('pointerdown', () => {
      this.scene.transition({
        target: 'StageScene',
        duration: 0,
        data: this.settings
      })
    })

    buttonSettings.on('pointerdown', () => {
      this.scene.get('ModalSettingsScene').events.emit('show', this.settings)
    })

    footerText.on('pointerdown', () => {
      this.scene.get('ModalCreditsScene').events.emit('show')
    })

    this.scene.get('ModalSettingsScene').events.on('ok', ({ size, speed }) => {
      this.settings.size = size
      this.settings.speed = speed
    })

    cont.add([heroCont, logoCont, title, buttonPlay, buttonSettings])
    Phaser.Display.Align.In.Center(cont, titleZone)
    Phaser.Display.Align.In.Center(buttonPlay, logoCont, -buttonPlay.width / 2, (logoHeight / 2) + 20)
    Phaser.Display.Align.In.Center(buttonSettings, logoCont, -buttonSettings.width / 2, (logoHeight / 2) + 90)
    Phaser.Display.Align.In.Center(title, logoCont)
    Phaser.Display.Align.In.BottomCenter(footerText, bgZone)
  }
}
