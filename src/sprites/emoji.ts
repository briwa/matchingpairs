import Phaser from 'phaser'

export default class Emoji extends Phaser.GameObjects.Sprite {
  private static readonly closedFrame = 1808
  public actualFrame: number
  private isOpened = false

  constructor (config) {
    super(config.scene, config.x, config.y, 'emoji', Emoji.closedFrame)
    this.scene.add.existing(this)

    this.actualFrame = config.actualFrame
    this.setInteractive()
  }

  toggle () {
    this.setFrame(this.isOpened ? Emoji.closedFrame : this.actualFrame)
    this.isOpened = !this.isOpened
  }
}