import Phaser from 'phaser'

interface Config {
  scene: Phaser.Scene
  tileX: number
  tileY: number
  tileSize: number
  actualFrame: number
}

export default class Emoji extends Phaser.GameObjects.Sprite {
  private static readonly closedFrame = 1808
  public isOpened = false
  public actualFrame: number

  constructor ({ scene, tileX, tileY, tileSize, actualFrame }: Config) {
    super(scene, tileSize * tileX, tileSize * tileY, 'emoji', Emoji.closedFrame)
    this.scene.add.existing(this)

    this.actualFrame = actualFrame
  }

  toggle () {
    this.setFrame(this.isOpened ? Emoji.closedFrame : this.actualFrame)
    this.isOpened = !this.isOpened
  }
}