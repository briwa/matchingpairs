import Phaser from 'phaser'
import Button from '../objects/button'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class ModalScene extends Phaser.Scene {
  constructor () {
    super({ key: 'ModalScene', active: true })
  }

  public init ({ text, onOk }) {
    
  }

  create () {
    const modalWidth = CANVAS_WIDTH / 1.5
    const modalHeight = CANVAS_HEIGHT / 2
    const bodyHeight = 240

    // Bg
    this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(.6)
      .setInteractive()

    const cont = this.add.container(0, 0)
    const modalCont = this.add.rectangle(0, 0, modalWidth, modalHeight, 0xff0000)
      .setOrigin(0, 0)
    const bodyCont = this.add.zone(0, 0, modalWidth, bodyHeight)
      .setOrigin(0, 0)
    const bodyText = this.add.text(0, 0, 'You lost the game.', {
      fontFamily: 'Fjalla One',
      fontSize: '40px'
    })

    const primaryButton = new Button({
      scene: this,
      label: 'OK',
      variant: 'primary',
      size: 'lg'
    })

    cont.add([modalCont, bodyCont, bodyText, primaryButton])

    const zone = this.add.zone(
      CANVAS_WIDTH / 2 - (modalWidth / 2),
      CANVAS_HEIGHT / 2 - (modalHeight / 2),
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    )

    Phaser.Display.Align.In.Center(cont, zone)
    Phaser.Display.Align.In.Center(bodyText, bodyCont)
    Phaser.Display.Align.In.Center(primaryButton, modalCont, -primaryButton.width / 2, modalHeight - bodyHeight + 10)
  }
}
