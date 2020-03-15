import Phaser from 'phaser'
import Button from '../../objects/button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../helpers/constants'

interface Config {
  key: string
  width?: number
  height?: number
}

interface Params {
  modal: Phaser.GameObjects.Container
  body: Phaser.GameObjects.Zone
}

interface ShownParams extends Params {
  options: Record<string, any>
}

export default class ModalBaseScene extends Phaser.Scene {
  constructor (config: Config) {
    super({ key: config.key, active: true })

    this.modalWidth = config.width || CANVAS_WIDTH / 1.5
    this.modalHeight = config.height || CANVAS_HEIGHT / 2
    this.bodyHeight = this.modalHeight - ModalBaseScene.FOOTER_HEIGHT
  }

  private static FOOTER_HEIGHT = 80
  private modal: Phaser.GameObjects.Container
  private bg: Phaser.GameObjects.Rectangle
  private body: Phaser.GameObjects.Zone
  private okButton: Button
  private modalWidth: number
  private modalHeight: number
  private bodyHeight: number

  create () {
    // BG
    this.bg = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(0)
      .setInteractive()

    this.modal = this.add.container(0, 0)
      .setVisible(false)
    const modalBg = this.add.rectangle(0, 0, this.modalWidth, this.modalHeight, 0xffffff)
      .setOrigin(0, 0)
    this.body = this.add.zone(0, 0, this.modalWidth, this.bodyHeight)
      .setOrigin(0, 0)

    this.okButton = new Button({
      scene: this,
      label: 'OK',
      variant: 'primary',
      size: 'lg'
    })

    this.modal.add([modalBg, this.body, this.okButton])

    const zone = this.add.zone(
      CANVAS_WIDTH / 2 - (this.modalWidth / 2),
      CANVAS_HEIGHT / 2 - (this.modalHeight / 2),
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    Phaser.Display.Align.In.Center(this.modal, zone)
    Phaser.Display.Align.In.Center(this.okButton, modalBg, -this.okButton.width / 2, this.modalHeight - this.bodyHeight + 10)

    this.events.on('show', this.show.bind(this))
    this.events.on('hide', this.hide.bind(this))
    this.okButton.on('pointerdown', () => {
      this.hide()
    })

    this.onCreated({ modal: this.modal, body: this.body })
  }

  protected onCreated (params: Params) {}
  protected onShown (params: ShownParams) {}
  protected onHidden (params: Params) {}

  private show (options) {
    this.bg.setAlpha(0.6)
    this.modal.setVisible(true)

    this.onShown({ modal: this.modal, body: this.body, options })
  }

  private hide () {
    this.bg.setAlpha(0)
    this.modal.setVisible(false)

    const value = this.onHidden({ modal: this.modal, body: this.body })
    this.events.emit('ok', value)
  }
}
