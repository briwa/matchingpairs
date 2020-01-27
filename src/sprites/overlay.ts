import Phaser from 'phaser'

export default class Overlay extends Phaser.GameObjects.Container {
  private overlayTextStyle = {
    font: '40px',
    fill: '#000000'
  }

  constructor (scene, text) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    const overlay = this.scene.add.rectangle(0, 0, 480, 640, 0xffffff)
      .setOrigin(0, 0)

    const title = this.scene.add
      .text(0, 0, text, this.overlayTextStyle)
      .setAlign('center')

    this.add([overlay, title])
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 480, 640), Phaser.Geom.Rectangle.Contains)

    Phaser.Display.Align.In.Center(title, overlay, 0, 0)
  }
}