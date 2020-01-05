import Phaser from 'phaser'

export default class Overlay extends Phaser.GameObjects.Container {
  private overlayTextStyle = {
    font: '28px',
    fill: '#000000'
  }

  constructor (scene, text) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    const overlay = this.scene.add.rectangle(0, 0, 480, 640, 0xffffff)
      .setOrigin(0, 0)
      .setInteractive()

    const title = this.scene.add
      .text(0, 0, text, this.overlayTextStyle)
      .setAlign('center')
    this.add([overlay, title])

    Phaser.Display.Align.In.Center(title, overlay, 0, 0)

    overlay.on('pointerdown', () => this.emit('pointerdown'))
  }
}