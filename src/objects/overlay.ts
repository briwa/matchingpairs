import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../helpers/constants'

export default class Overlay extends Phaser.GameObjects.Container {
  constructor (scene, text) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    const overlay = this.scene.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0xffffff)
      .setOrigin(0, 0)

    const title = this.scene.add
      .text(0, 0, text, {
        fontFamily: 'Fjalla One',
        fontSize: '40px',
        fill: '#000000'
      })
      .setAlign('center')

    this.add([overlay, title])
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT), Phaser.Geom.Rectangle.Contains)

    Phaser.Display.Align.In.Center(title, overlay, 0, 0)
  }
}