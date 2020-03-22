import Phaser from 'phaser'
import Game from '../index'
import LevelMain from '../levels/main'

export default class Stage extends Phaser.Scene {
  private static readonly MARGIN = 20
  private static readonly TILESIZE = 64
  private static readonly LAST_FRAME = 99
  private level: LevelMain
  private size: number
  private speed: number
  private group: Phaser.GameObjects.Group
  private ui: Phaser.Scene

  constructor () {
    super({ key: 'Stage' })
  }

  preload () {
    // 91 icons (10*9 + 1)
    // https://github.com/twitter/twemoji
    this.load.spritesheet('emoji', 'assets/emoji-64.png', { frameWidth: Stage.TILESIZE, frameHeight: Stage.TILESIZE })
  }

  init ({ size, speed }) {
    this.size = size
    this.speed = speed
  }

  create () {
    this.ui = this.scene.get('UI')
    this.ui.events.on('reset-level', this.resetLevel.bind(this))
    this.ui.events.on('home', () => {
      this.scene.transition({
        duration: 0,
        target: 'Home'
      })
    })

    this.resetLevel()
  }

  private onPointerDown (sprite) {
    const tileX = Math.floor(sprite.x / Stage.TILESIZE)
    const tileY = Math.floor(sprite.y / Stage.TILESIZE)
    const tileIdx = (tileY * this.size) + tileX
    const { current, lastOpened, shouldOpen, isPaired } = this.level.toggle(tileIdx)

    if (shouldOpen) {
      sprite.setFrame(current.tile)
    } else {
      sprite.setFrame(Stage.LAST_FRAME)
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
          lastOpenedSprite.setFrame(Stage.LAST_FRAME)
          sprite.setFrame(Stage.LAST_FRAME)
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

    const tilesCount = Stage.LAST_FRAME
    const tiles = []
    const allTiles = Array.from({length: tilesCount}, (v, i) => i)
    const maxUniqueTilesCount = Math.pow(this.size, 2) / 2

    while (allTiles.length > tilesCount - maxUniqueTilesCount) {
      let pairCount = 2
      const randomTileIdx = Math.floor(Math.random() * allTiles.length)
      const randomTile = allTiles[randomTileIdx]
      while (pairCount) {
        const randomShuffledIdx = Math.floor(Math.random() * tiles.length)
        tiles.splice(randomShuffledIdx, 0, randomTile)
        pairCount--
      }
      allTiles.splice(randomTileIdx, 1)
    }

    this.level = new LevelMain(tiles)

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const emoji = this.add.sprite(Stage.TILESIZE * column, Stage.TILESIZE * row, 'emoji', Stage.LAST_FRAME)
        emoji.setInteractive().on('pointerdown', () => this.onPointerDown.call(this, emoji))
        this.group.add(emoji)
      }
    }

    this.cameras.main
      .centerOn(Stage.TILESIZE / 2 * (this.size - 1), Stage.TILESIZE / 2 * (this.size - 1))
      .setZoom((Game.CANVAS_WIDTH - Stage.MARGIN) / (Stage.TILESIZE * this.size))

    this.ui.events.emit('start-level', {
      maxScore: Math.pow(this.size, 2),
      speed: this.speed
    })
  }
}
