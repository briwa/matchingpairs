import Phaser from 'phaser'
import Emoji from '../sprites/emoji'
import UIScene from './ui'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  public openedEmojis: Emoji[][] = [[]]
  public size = 4
  private tileSize = 64
  private zoomFactor = 1
  private group: Phaser.GameObjects.Group

  get score () {
    const foo = Math.floor(this.openedEmojis.length / 2)
    console.log(foo)
    return foo
  }


  resetLevel () {
    this.group.children.each((child) => child.destroy())
    this.openedEmojis = [[]]
    this.setupLevel()
  }

  preload () {
    // 46 icons (10*5)
    // https://github.com/twitter/twemoji
    this.load.spritesheet('emoji', 'assets/emoji-64.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.scene.add('UIScene', UIScene, true, { parent: this })

    this.setupLevel()
  }

  private onPointerDown (emoji: Emoji) {
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

  private setupLevel () {
    this.group = this.group || this.add.group()

    const shuffledEmojis = Phaser.Math.RND.shuffle(Array.from({length: 45}, (v, i) => i))
      .slice(0, Math.pow(this.size, 2) / 2)

    const tiles = shuffledEmojis.reduce((tiles, number, idx) => {
      tiles.push(shuffledEmojis[idx], shuffledEmojis[idx])
      return tiles
    }, [])

    const shuffledTiles = Phaser.Math.RND.shuffle(tiles)

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
