import Phaser from 'phaser'
import Emoji from '../sprites/emoji'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  private size = 4
  private tileSize = 32
  private zoomFactor = 1.5
  private level: Emoji[][] = []
  private openEmojis: Emoji[] = []

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
      const spriteRow = []
      for (let row = 0; row < this.size; row++) {
        const sprite = new Emoji({
          scene: this,
          x: column * this.tileSize,
          y: row * this.tileSize,
          actualFrame: shuffledTiles[(column * this.size) + row]
        })

        spriteRow.push(sprite)
      }

      this.level.push(spriteRow)
    }

    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.input.on('pointerdown', this.onPointerDown.bind(this))
  }

  onPointerDown (pointer, sprites,  dragX, dragY) {
    const emoji = sprites[0]
    if (emoji instanceof Emoji) {
      const similarEmojis = this.openEmojis.filter((openEmoji) => emoji.actualFrame === openEmoji.actualFrame)

      if (similarEmojis.length >= 2) {
        return
      }

      emoji.toggle()

      const lastOpenedEmoji = this.openEmojis[this.openEmojis.length - 1]
      if (similarEmojis[0] || this.openEmojis.length % 2 === 0) {
        this.openEmojis.push(emoji)
        return
      }

      // Disallow clicking momentarily
      // since we have to show the opened sprites for a while
      this.input.enabled = false
      this.openEmojis.pop()

      this.time.delayedCall(500, () => {
        lastOpenedEmoji.toggle()
        emoji.toggle()
        this.input.enabled = true
      })
    }
  }
}
