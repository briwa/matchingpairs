import ModalBase from './index'
import Options from '../../objects/options'

export default class ModalSettings extends ModalBase {
  private static readonly SIZES = [
    { text: '2x2', value: 2 },
    { text: '4x4', value: 4 },
    { text: '6x6', value: 6 },
    { text: '8x8', value: 8 }
  ]
  private static readonly SPEED = [
    { text: 'beginner', value: 1500 },
    { text: 'medium', value: 1000 },
    { text: 'advanced', value: 700 },
    { text: 'pro', value: 400 }
  ]
  private sizeOptions: Options
  private speedOptions: Options

  constructor () {
    super({
      key: 'ModalSettings',
      width: 300,
      height: 300
    })
  }

  onCreated () {
    const sizeLabel = this.add.text(0, 0, 'Tiles', {
      fill: '#000000',
      fontSize: 30
    })

    this.sizeOptions = new Options({
      scene: this,
      values: ModalSettings.SIZES,
      style: {
        width: 80,
        fontSize: 30
      }
    })

    const speedLabel = this.add.text(0, 0, 'Timer\nspeed', {
      fill: '#000000',
      fontSize: 30
    })

    this.speedOptions = new Options({
      scene: this,
      values: ModalSettings.SPEED,
      style: {
        width: 100,
        fontSize: 30
      }
    })

    // TODO: Figure out why the options are going one step lower when width is specified.
    this.modal.add([sizeLabel, this.sizeOptions, speedLabel, this.speedOptions])
    Phaser.Display.Align.In.TopLeft(sizeLabel, this.body, -30, -30)
    Phaser.Display.Align.In.TopLeft(speedLabel, this.body, -30, -94)
    Phaser.Display.Align.In.TopCenter(this.sizeOptions, this.body)
    Phaser.Display.Align.In.TopCenter(this.speedOptions, this.body, 0, -55)
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
