import Phaser from 'phaser'

interface Config {
  scene: Phaser.Scene
  initialValue?: string | number
  values: { text: string, value: string | number }[]
}

export default class Options extends Phaser.GameObjects.Container {
  private static VALUE_MARGIN = 10
  private static COLOR_PRIMARY = '#CCCCCC'
  private static COLOR_SECONDARY = '#000000'
  private values: Config['values']
  private valueIdx: number = null

  constructor ({ scene, values, initialValue }: Config) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    this.values = values

    let xPos = 0
    this.values.forEach((value, idx) => {
      const text = this.scene.add.text(xPos, 0, value.text, {
        fill: Options.COLOR_SECONDARY
      })

      if (typeof initialValue !== 'undefined' && value.value === initialValue) {
        text.setColor(Options.COLOR_PRIMARY)
        this.valueIdx = idx
      }

      xPos += text.width + Options.VALUE_MARGIN
      this.add([text])

      text.setInteractive()
          .on('pointerdown', () => this.select(idx))
    })
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