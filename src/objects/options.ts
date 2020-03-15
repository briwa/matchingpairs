import Phaser from 'phaser'

interface Config {
  scene: Phaser.Scene
  values: { text: string, value: string | number }[]
  initialValue?: string | number
  style?: {
    width?: number
    fontSize?: number
  }
}

export default class Options extends Phaser.GameObjects.Container {
  private static readonly FONT_SIZE = 20
  private static readonly MARGIN = {
    x: Options.FONT_SIZE / 2,
    y: Options.FONT_SIZE + (Options.FONT_SIZE / 4)
  }
  private static readonly COLOR_PRIMARY = '#CCCCCC'
  private static readonly COLOR_SECONDARY = '#000000'
  private values: Config['values']
  private valueIdx: number = null

  constructor ({ scene, values, initialValue, style }: Config) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    this.values = values
    const { width, fontSize } = style || {}

    let xPos = 0
    let yPos = 0
    this.values.forEach((value, idx) => {
      const text = this.scene.add.text(xPos, yPos, value.text, {
        fill: Options.COLOR_SECONDARY,
        fontSize: fontSize || Options.FONT_SIZE
      })

      if (typeof initialValue !== 'undefined' && value.value === initialValue) {
        this.select(idx)
      }

      const nextXPos = xPos + text.width
      if (typeof width === 'undefined' || nextXPos < width) {
        xPos = nextXPos + Options.MARGIN.x
      } else {
        xPos = 0
        yPos += Options.MARGIN.y
      }

      this.add([text])
      text.setInteractive()
          .on('pointerdown', () => this.select(idx))
    })

    this.setSize(typeof width === 'undefined' ? xPos : Math.min(xPos, width), yPos)
  }

  get value () {
    if (this.valueIdx === null) {
      return null
    }

    return this.values[this.valueIdx].value
  }

  set value (val: string | number) {
    this.select(this.values.findIndex((value) => value.value === val))
  }

  private select (idx: number) {
    if (this.valueIdx !== null) {
      const currentSelectedText = this.getAt(this.valueIdx) as Phaser.GameObjects.Text
      currentSelectedText.setColor(Options.COLOR_SECONDARY)
    }

    const currentSelectedText = this.getAt(idx) as Phaser.GameObjects.Text
    currentSelectedText.setColor(Options.COLOR_PRIMARY)
    this.valueIdx = idx
  }
}