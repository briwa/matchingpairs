import Phaser from 'phaser'
import Emoji from '../sprites/emoji'
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
  private group: Phaser.GameObjects.Group


  resetLevel () {
    this.group.children.each((child) => child.destroy())
    this.level.reset()
    this.setupLevel()
  }

  preload () {
    // 46 icons (10*5)
    // https://github.com/twitter/twemoji
    this.load.spritesheet('emoji', 'assets/emoji-64.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.level = new MainLevel(this.size)
    this.scene.add('UIScene', UIScene, true, { parent: this })

    this.setupLevel()
  }

  private onPointerDown (emoji: Emoji) {
    const { lastOpenedEmoji, paired } = this.level.toggleEmoji(emoji)

    if (paired) {
      emoji.off('pointerdown')
      lastOpenedEmoji.off('pointerdown')
    } else if (lastOpenedEmoji && lastOpenedEmoji !== emoji) {
      this.input.enabled = false
      this.time.delayedCall(500, () => {
        lastOpenedEmoji.toggle()
        emoji.toggle()
        this.input.enabled = true
      })
    }

    emoji.toggle()
  }

  private setupLevel () {
    this.group = this.group || this.add.group()
    const shuffledTiles = this.level.create()

    for (let column = 0; column < this.size; column++) {
      for (let row = 0; row < this.size; row++) {
        const actualFrame = shuffledTiles[(column * this.size) + row]
        const sprite = new Emoji({
          scene: this,
          tileX: column,
          tileY: row,
          tileSize: this.tileSize,
          actualFrame
        })

        sprite.setInteractive().on('pointerdown', () => this.onPointerDown.call(this, sprite))
        this.group.add(sprite)
      }
    }
  }
}
