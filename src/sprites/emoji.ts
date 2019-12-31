import Phaser from 'phaser'

export default class Emoji extends Phaser.GameObjects.Sprite {
  private static readonly closedFrame = 1808
  private currentFrame: number
  private isOpened = false
  private isPaired = false

  constructor (config) {
    super(config.scene, config.x, config.y, 'emoji', Emoji.closedFrame)
    this.scene.add.existing(this)

    this.currentFrame = config.frame
    this.setInteractive()
  }

  toggle () {
    if (this.isPaired) {
      return
    }

    this.setFrame(this.isOpened ? Emoji.closedFrame : this.currentFrame)
    this.isOpened = !this.isOpened
  }
}