import ModalBase from './index'
import Options from '../../objects/options'

export default class ModalSettings extends ModalBase {
  private static readonly SIZES = [
    { text: '2x2', value: 2 },
    { text: '4x4', value: 4 },
    { text: '6x6', value: 6 },
    { text: '8x8', value: 8 },
    { text: '10x10', value: 10 },
    { text: '12x12', value: 12 },
    { text: '14x14', value: 14 }
  ]
  private static readonly SPEED = [
    { text: 'beginner', value: 1500 },
    { text: 'medium', value: 1000 },
    { text: 'advanced', value: 700 },
    { text: 'pro', value: 400 }
  ]
  private static readonly FONT_SIZE = 22
  private sizeOptions: Options
  private speedOptions: Options

  constructor () {
    super({
      key: 'ModalSettings',
      width: 300,
      height: 350
    })
  }

  onCreated () {
    const sizeLabel = this.add.text(0, 0, 'Tiles', {
      fill: '#000000',
      fontSize: ModalSettings.FONT_SIZE
    })

    this.sizeOptions = new Options({
      scene: this,
      values: ModalSettings.SIZES,
      style: {
        width: 80,
        fontSize: ModalSettings.FONT_SIZE
      }
    })

    const speedLabel = this.add.text(0, 0, 'Timer\nspeed', {
      fill: '#000000',
      fontSize: ModalSettings.FONT_SIZE
    })

    this.speedOptions = new Options({
      scene: this,
      values: ModalSettings.SPEED,
      style: {
        width: 60,
        fontSize: ModalSettings.FONT_SIZE
      }
    })

    // TODO: Figure out why the options are going one step lower when width is specified.
    this.modal.add([sizeLabel, this.sizeOptions, speedLabel, this.speedOptions])
    Phaser.Display.Align.In.TopLeft(sizeLabel, this.body, -30, -30)
    Phaser.Display.Align.In.TopLeft(speedLabel, this.body, -30, -144)
    Phaser.Display.Align.In.TopCenter(this.sizeOptions, this.body, 0, 10)
    Phaser.Display.Align.In.TopCenter(this.speedOptions, this.body, 0, -105)
  }

  onShown ({ size, speed }) {
    this.sizeOptions.value = size
    this.speedOptions.value = speed
  }

  onHidden () {
    return {
      size: this.sizeOptions.value,
      speed: this.speedOptions.value
    }
  }
}
