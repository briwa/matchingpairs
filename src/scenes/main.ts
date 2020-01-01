import Phaser from 'phaser'
import Emoji from '../sprites/emoji'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  private size = 4
  private tileSize = 32
  private zoomFactor = 1.5
  private openedEmojis: Emoji[][] = [[]]

  preload () {
    // 42 columns * 44 rows
    // https://github.com/Deveo/emojione-png-sprites
    this.load.spritesheet('emoji', 'assets/sprite-32.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    const shuffledEmojis = Phaser.Math.RND.shuffle(Array.from({length: 42 * 44}, (v, i) => i))
      .slice(0, Math.pow(this.size, 2) / 2)

    const shuffledTiles = Phaser.Math.RND.shuffle(shuffledEmojis.reduce((tiles, number, idx) => {
      tiles.push(shuffledEmojis[idx], shuffledEmojis[idx])
      return tiles
    }, []))

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
      }
    }

    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
  }

  onPointerDown (emoji: Emoji) {
    const lastOpenedEmojis = this.openedEmojis[this.openedEmojis.length - 1]

    if (!lastOpenedEmojis.length) {
      lastOpenedEmojis.push(emoji)
    } else {
      const lastOpenedEmoji = lastOpenedEmojis[0]
      if (emoji.isOpened) {
        lastOpenedEmojis.pop()
      } else if (lastOpenedEmoji.actualFrame === emoji.actualFrame) {
        lastOpenedEmoji.off('pointerdown')
        emoji.off('pointerdown')

        lastOpenedEmojis.push(emoji)
        this.openedEmojis.push([])
      } else {
        this.input.enabled = false
        this.time.delayedCall(500, () => {
          lastOpenedEmoji.toggle()
          emoji.toggle()
          lastOpenedEmojis.pop()

          this.input.enabled = true
        })
      }
    }

    emoji.toggle()
  }
}
