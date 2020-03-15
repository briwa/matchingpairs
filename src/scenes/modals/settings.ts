import ModalBaseScene from './index'
import Options from '../../objects/options'

export default class ModalSettingsScene extends ModalBaseScene {
  constructor () {
    super({
      key: 'ModalSettingsScene',
      width: 300,
      height: 200
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
    const sizeLabel = this.add.text(0, 0, 'Tiles', {
      fill: '#000000',
      fontSize: 30
    })

    this.sizeOptions = new Options({
      scene: this,
      values: ModalSettingsScene.SIZES,
      style: {
        width: 80,
        fontSize: 30
      }
    })

    modal.add([sizeLabel, this.sizeOptions])
    Phaser.Display.Align.In.TopLeft(sizeLabel, body, -30, -28)
    Phaser.Display.Align.In.TopCenter(this.sizeOptions, body)
  }

  onShown ({ options }) {
    this.sizeOptions.value = options.value
  }

  onHidden () {
    return this.sizeOptions.value
  }
}
