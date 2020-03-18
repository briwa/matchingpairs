import ModalBaseScene from './index'

export default class ModalGenericScene extends ModalBaseScene {
  private description: Phaser.GameObjects.Text

  constructor () {
    super({ key: 'ModalGenericScene' })
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