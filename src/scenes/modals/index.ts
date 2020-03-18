import Phaser from 'phaser'
import Button from '../../objects/button'
import Game from '../../index'

interface Config {
  key: string
  width?: number
  height?: number
}

export default class ModalBase extends Phaser.Scene {
  public static readonly MARGIN = { x: 10, y: 10 }
  private static readonly FOOTER_HEIGHT = 80
  protected modal: Phaser.GameObjects.Container
  protected body: Phaser.GameObjects.Zone
  private bg: Phaser.GameObjects.Rectangle
  private okButton: Button
  private modalWidth: number
  private modalHeight: number
  private bodyHeight: number

  constructor (config: Config) {
    super({ key: config.key, active: true })

    this.modalWidth = config.width || Game.CANVAS_WIDTH / 1.5
    this.modalHeight = config.height || Game.CANVAS_HEIGHT / 2
    this.bodyHeight = this.modalHeight - ModalBase.FOOTER_HEIGHT
  }

  create () {
    // BG
    this.bg = this.add.rectangle(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT, 0x000000)
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
      Game.CANVAS_WIDTH / 2 - (this.modalWidth / 2),
      Game.CANVAS_HEIGHT / 2 - (this.modalHeight / 2),
      Game.CANVAS_WIDTH,
      Game.CANVAS_HEIGHT
    )

    Phaser.Display.Align.In.Center(this.modal, zone)
    Phaser.Display.Align.In.BottomCenter(
      this.okButton,
      modalBg,
      -this.okButton.width / 2,
      -this.okButton.height / 2 - ModalBase.MARGIN.y
    )

    this.events.on('show', this.show.bind(this))
    this.events.on('hide', this.hide.bind(this))
    this.okButton.on('pointerdown', () => {
      this.hide()
    })

    this.onCreated()
  }

  protected onCreated () {}
  protected onShown (params: Record<string, any>) {}
  protected onHidden () {}

  private show (options) {
    this.bg.setAlpha(0.6)
    this.modal.setVisible(true)

    this.onShown(options)
  }

  private hide () {
    this.bg.setAlpha(0)
    this.modal.setVisible(false)

    const response = this.onHidden()
    this.events.emit('ok', response)
  }
}
