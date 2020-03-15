import ModalBaseScene from './index'
import Options from '../../objects/options'

export default class ModalSettingsScene extends ModalBaseScene {
  constructor () {
    super({
      key: 'ModalSettingsScene',
      width: 400
    })
  }

  private static readonly SIZES = [
    { text: '2x2', value: 2 },
    { text: '4x4', value: 4 },
    { text: '6x6', value: 6 },
    { text: '8x8', value: 8 }
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
