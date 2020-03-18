import ModalBase from './index'

export default class ModalGeneric extends ModalBase {
  private description: Phaser.GameObjects.Text

  constructor () {
    super({ key: 'ModalGeneric' })
  }

  onCreated () {
    this.description = this.add.text(0, 0, '', {
      fontFamily: 'Maven Pro',
      fontSize: '40px',
      color: '#000000'
    })

    this.modal.add([this.description])
  }

  onShown ({ text }) {
    this.description.text = text
    Phaser.Display.Align.In.Center(this.description, this.body)
  }
}