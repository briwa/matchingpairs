import ModalBaseScene from './index'

export default class ModalGenericScene extends ModalBaseScene {
  constructor () {
    super({ key: 'ModalGenericScene' })
  }

  private description: Phaser.GameObjects.Text

  onCreated () {
    this.description = this.add.text(0, 0, '', {
      fontFamily: 'Maven Pro',
      fontSize: '40px',
      color: '#000000'
    })

    this.modal.add([this.description])
  }

  onShown ({ options, body }) {
    this.description.text = options.text
    Phaser.Display.Align.In.Center(this.description, body)
  }
}