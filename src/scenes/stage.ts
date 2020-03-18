import Phaser from 'phaser'
import Game from '../index'
import MainLevel from '../levels/main'

export default class StageScene extends Phaser.Scene {
  private static readonly MARGIN = 20
  private static readonly TILESIZE = 64
  private static readonly LAST_FRAME = 59
  private level: MainLevel
  private size: number
  private speed: number
  private group: Phaser.GameObjects.Group
  private ui: Phaser.Scene

  constructor () {
    super({ key: 'StageScene' })
  }

  preload () {
    // 46 icons (10*5)
    // https://github.com/twitter/twemoji
    this.load.spritesheet('emoji', 'assets/emoji-64.png', { frameWidth: StageScene.TILESIZE, frameHeight: StageScene.TILESIZE })
  }

  init ({ size, speed }) {
    this.size = size
    this.speed = speed
  }

  create () {
    this.ui = this.scene.get('UIScene')
    this.ui.events.on('reset-level', this.resetLevel.bind(this))
    this.ui.events.on('home', () => {
      this.scene.transition({
        duration: 0,
        target: 'HomeScene'
      })
    })

    this.resetLevel()
  }

  private onPointerDown (sprite) {
    const tileX = Math.floor(sprite.x / StageScene.TILESIZE)
    const tileY = Math.floor(sprite.y / StageScene.TILESIZE)
    const tileIdx = (tileY * this.size) + tileX
    const { current, lastOpened, shouldOpen, isPaired } = this.level.toggle(tileIdx)

    if (shouldOpen) {
      sprite.setFrame(current.tile)
    } else {
      sprite.setFrame(StageScene.LAST_FRAME)
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
          lastOpenedSprite.setFrame(StageScene.LAST_FRAME)
          sprite.setFrame(StageScene.LAST_FRAME)
          this.input.enabled = true
        })
      }
    }
  }

  private resetLevel () {
    if (this.group && this.group.children) {
      this.group.children.each((child) => child.destroy())
    } else {
      this.group = this.add.group()
    }

    const tilesCount = StageScene.LAST_FRAME - 1
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
        const emoji = this.add.sprite(StageScene.TILESIZE * column, StageScene.TILESIZE * row, 'emoji', StageScene.LAST_FRAME)
        emoji.setInteractive().on('pointerdown', () => this.onPointerDown.call(this, emoji))
        this.group.add(emoji)
      }
    }

    this.cameras.main
      .centerOn(StageScene.TILESIZE / 2 * (this.size - 1), StageScene.TILESIZE / 2 * (this.size - 1))
      .setZoom((Game.CANVAS_WIDTH - StageScene.MARGIN) / (StageScene.TILESIZE * this.size))

    this.ui.events.emit('start-level', {
      maxScore: Math.pow(this.size, 2),
      speed: this.speed
    })
  }
}
