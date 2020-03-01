import Phaser from 'phaser'
import Button from '../objects/button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class ModalScene extends Phaser.Scene {
  constructor () {
    super({ key: 'ModalScene', active: true })
  }

  private modal: Phaser.GameObjects.Container
  private bg: Phaser.GameObjects.Rectangle
  private body: Phaser.GameObjects.Zone
  private description: Phaser.GameObjects.Text
  private okButton: Button

  create () {
    const modalWidth = CANVAS_WIDTH / 1.5
    const modalHeight = CANVAS_HEIGHT / 2
    const bodyHeight = 240

    // BG
    this.bg = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(0)
      .setInteractive()

    this.modal = this.add.container(0, 0)
      .setVisible(false)
    const modalCont = this.add.rectangle(0, 0, modalWidth, modalHeight, 0xffffff)
      .setOrigin(0, 0)
    this.body = this.add.zone(0, 0, modalWidth, bodyHeight)
      .setOrigin(0, 0)

    this.description = this.add.text(0, 0, '', {
      fontFamily: 'Fjalla One',
      fontSize: '40px',
      color: '#000000'
    })

    this.okButton = new Button({
      scene: this,
      label: 'OK',
      variant: 'primary',
      size: 'lg'
    })

    this.modal.add([modalCont, this.body, this.description, this.okButton])

    const zone = this.add.zone(
      CANVAS_WIDTH / 2 - (modalWidth / 2),
      CANVAS_HEIGHT / 2 - (modalHeight / 2),
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    Phaser.Display.Align.In.Center(this.modal, zone)
    Phaser.Display.Align.In.Center(this.okButton, modalCont, -this.okButton.width / 2, modalHeight - bodyHeight + 10)

    this.events.on('show', this.show.bind(this))
    this.events.on('hide', this.hide.bind(this))

    this.okButton.on('pointerdown', () => {
      this.hide()
      this.events.emit('ok')
    })
  }

  private show ({ text }) {
    this.description.text = text
    Phaser.Display.Align.In.Center(this.description, this.body)

    this.bg.setAlpha(0.6)
    this.modal.setVisible(true)
  }

  private hide () {
    this.bg.setAlpha(0)
    this.modal.setVisible(false)
  }
}
