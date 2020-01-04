import Phaser from 'phaser'

export default class Overlay extends Phaser.GameObjects.Container {
  private overlayTextStyle = {
    font: '28px',
    fill: '#000000'
  }

  constructor (scene) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    const overlay = this.scene.add.rectangle(0, 0, 480, 640, 0xffffff)
      .setOrigin(0, 0)
      .setInteractive()
    const overlayText = this.scene.add
      .text(0, 0, 'You win!\n Tap anywhere to play again.', this.overlayTextStyle)
      .setAlign('center')
    this.add([overlay, overlayText])

    Phaser.Display.Align.In.Center(overlayText, overlay, 0, 0)

    overlay.on('pointerdown', () => this.emit('pointerdown'))
  }
}