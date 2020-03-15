import Phaser from 'phaser'
import WebFont from 'webfontloader'
import Button from '../objects/button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

const { version: AppVersion } = require('../../package.json')

export default class HomeScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HomeScene', active: true })
  }

  private settings = {
    size: 4,
    speed: 'medium'
  }
  private modalSettings: Phaser.Scene

  create () {
    WebFont.load({
      custom: {
        families: ['Squada One', 'Maven Pro']
      },
      active: this.onLoaded.bind(this)
    })
  }

  private onLoaded () {
    this.modalSettings = this.scene.get('ModalSettingsScene')

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
    const buttonPlay = new Button({
      scene: this,
      label: 'play',
      variant: 'primary',
      size: 'lg'
    })
    const buttonSettings = new Button({
      scene: this,
      label: 'settings',
      variant: 'primary',
      size: 'md'
    })

    const footerText = this.add.text(0, 0, `v${AppVersion} | Made by Briwa | Tap to see credits.`, {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      align: 'center',
      fill: '#000000'
    }).setInteractive()

    buttonPlay.on('pointerdown', () => {
      this.scene.setActive(false, 'HomeScene')
      this.scene.setActive(true, 'GameScene')
      this.scene.switch('GameScene')
    })

    buttonSettings.on('pointerdown', () => {
      this.scene.get('ModalSettingsScene').events.emit('show', { value: this.settings.size })
    })

    footerText.on('pointerdown', () => {
      this.scene.switch('CreditsScene')
    })

    this.modalSettings.events.on('ok', (size: number) => {
      this.settings.size = size
    })

    cont.add([heroCont, logoCont, title, buttonPlay, buttonSettings])
    Phaser.Display.Align.In.Center(cont, titleZone)
    Phaser.Display.Align.In.Center(buttonPlay, logoCont, -buttonPlay.width / 2, (logoHeight / 2) + 20)
    Phaser.Display.Align.In.Center(buttonSettings, logoCont, -buttonSettings.width / 2, (logoHeight / 2) + 90)
    Phaser.Display.Align.In.Center(title, logoCont)
    Phaser.Display.Align.In.BottomCenter(footerText, bgZone)
  }
}
