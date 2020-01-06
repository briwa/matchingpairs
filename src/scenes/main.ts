import Phaser from 'phaser'
import UIScene from './ui'
import MainLevel from '../levels/main'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  public level: MainLevel
  public size = 4
  private tileSize = 64
  private zoomFactor = 1
  private closedFrame = 45
  private group: Phaser.GameObjects.Group
  private ui: Phaser.Scene


  resetLevel () {
    this.group.children.each((child) => child.destroy())
    this.setupLevel()
    this.ui.events.emit('start', { maxScore: Math.pow(this.size, 2) })
  }

  preload () {
    // 46 icons (10*5)
    // https://github.com/twitter/twemoji
    this.load.spritesheet('emoji', 'assets/emoji-64.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.level = new MainLevel(this.size)
    this.ui = this.scene.add('UIScene', UIScene, true)
    this.ui.events.on('reset', this.resetLevel.bind(this))

    this.setupLevel()
  }

  private onPointerDown (sprite) {
    const tileX = Math.floor(sprite.x / this.tileSize)
    const tileY = Math.floor(sprite.y / this.tileSize)
    const tileIdx = (tileY * this.size) + tileX
    const { current, lastOpened, shouldOpen, isPaired } = this.level.toggleTile(tileIdx)

    if (shouldOpen) {
      sprite.setFrame(current.tile)
    } else {
      sprite.setFrame(this.closedFrame)
    }

    if (lastOpened) {
      const lastOpenedSprite = this.group.getChildren()[lastOpened.idx] as Phaser.GameObjects.Sprite

      if (isPaired) {
        sprite.off('pointerdown')
        lastOpenedSprite.off('pointerdown')

        this.ui.events.emit('score', { score: this.level.openedTiles.length - 1 })
      } else if (shouldOpen) {
        this.input.enabled = false
        this.time.delayedCall(500, () => {
          lastOpenedSprite.setFrame(this.closedFrame)
          sprite.setFrame(this.closedFrame)
          this.input.enabled = true
        })
      }
    }
  }

  private setupLevel () {
    this.group = this.group || this.add.group()
    this.level.create()

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const emoji = this.add.sprite(this.tileSize * column, this.tileSize * row, 'emoji', this.closedFrame)
        emoji.setInteractive().on('pointerdown', () => this.onPointerDown.call(this, emoji))
        this.group.add(emoji)
      }
    }
  }
}
