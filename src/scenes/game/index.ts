import Phaser from 'phaser'
import UIScene from './ui'
import MainLevel from '../../levels/main'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  public level: MainLevel
  public size = 4
  private tileSize = 64
  private zoomFactor = 1.75
  private lastFrame = 59
  private group: Phaser.GameObjects.Group
  private ui: Phaser.Scene

  preload () {
    // 46 icons (10*5)
    // https://github.com/twitter/twemoji
    this.load.spritesheet('emoji', 'assets/emoji-64.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.cameras.main.setBackgroundColor(0xffffff)

    this.ui = this.scene.add('UIScene', UIScene, true)
    this.ui.events.on('reset-level', this.resetLevel.bind(this))

    this.resetLevel()
  }

  private onPointerDown (sprite) {
    const tileX = Math.floor(sprite.x / this.tileSize)
    const tileY = Math.floor(sprite.y / this.tileSize)
    const tileIdx = (tileY * this.size) + tileX
    const { current, lastOpened, shouldOpen, isPaired } = this.level.toggle(tileIdx)

    if (shouldOpen) {
      sprite.setFrame(current.tile)
    } else {
      sprite.setFrame(this.lastFrame)
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
          lastOpenedSprite.setFrame(this.lastFrame)
          sprite.setFrame(this.lastFrame)
          this.input.enabled = true
        })
      }
    }
  }

  private resetLevel () {
    if (this.group) {
      this.group.children.each((child) => child.destroy())
    } else {
      this.group = this.add.group()
    }

    const tilesCount = this.lastFrame - 1
    const tiles = []
    const allTiles = Array.from({length: tilesCount}, (v, i) => i)
    const maxUniqueTilesCount = Math.pow(this.size, 2) / 2

    while (allTiles.length > tilesCount - maxUniqueTilesCount) {
      let pairCount = 2
      const randomTileIdx = Math.floor(Math.random() * allTiles.length - 1)
      const randomTile = allTiles[randomTileIdx]
      while (pairCount) {
        const randomShuffledIdx = Math.floor(Math.random() * tiles.length - 1)
        tiles.splice(randomShuffledIdx, 0, randomTile)
        pairCount--
      }
      allTiles.splice(randomTileIdx, 1)
    }

    this.level = new MainLevel(tiles)

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const emoji = this.add.sprite(this.tileSize * column, this.tileSize * row, 'emoji', this.lastFrame)
        emoji.setInteractive().on('pointerdown', () => this.onPointerDown.call(this, emoji))
        this.group.add(emoji)
      }
    }

    this.cameras.main
      .centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1))
      .setZoom(this.zoomFactor)

    this.ui.events.emit('start-level', { maxScore: Math.pow(this.size, 2) })
  }
}
