import ModalBaseScene from './index'
import Options from '../../objects/options'

export default class ModalSettingsScene extends ModalBaseScene {
  constructor () {
    super({
      key: 'ModalSettingsScene',
      width: 400
    })
  }

  private static SIZES = [
    { text: '3x3', value: 3 },
    { text: '4x4', value: 4 },
    { text: '5x5', value: 5 },
    { text: '6x6', value: 6 },
    { text: '7x7', value: 7 }
  ]
  private sizeOptions: Options

  onCreated ({ modal, body }) {
    this.sizeOptions = new Options({
      scene: this,
      values: ModalSettingsScene.SIZES
    })

    modal.add([this.sizeOptions])
    Phaser.Display.Align.In.Center(this.sizeOptions, body)
  }

  onShown ({ options }) {
    this.sizeOptions.value = options.value
  }

  onHidden () {
    return this.sizeOptions.value
  }
}
