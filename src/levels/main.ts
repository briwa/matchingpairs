import Phaser from 'phaser'
import Emoji from '../sprites/emoji'

export default class MainLevel {
  public openedEmojis: Emoji[][] = [[]]
  private size: number

  constructor(size) {
    this.size = size
  }

  create() {
    const shuffledEmojis = Phaser.Math.RND.shuffle(Array.from({length: 45}, (v, i) => i))
      .slice(0, Math.pow(this.size, 2) / 2)

    const tiles = shuffledEmojis.reduce((tiles, number, idx) => {
      tiles.push(shuffledEmojis[idx], shuffledEmojis[idx])
      return tiles
    }, [])

    return Phaser.Math.RND.shuffle(tiles)
  }

  reset () {
    this.openedEmojis = [[]]
  }

  toggleEmoji(emoji: Emoji) {
    const lastOpenedEmojis = this.openedEmojis[this.openedEmojis.length - 1]
    const lastOpenedEmoji = lastOpenedEmojis[0]
    const paired = lastOpenedEmoji
      && lastOpenedEmoji !== emoji
      && lastOpenedEmoji.actualFrame === emoji.actualFrame

    if (!lastOpenedEmojis.length) {
      lastOpenedEmojis.push(emoji)
    } else {
      if (paired) {
        lastOpenedEmojis.push(emoji)
        this.openedEmojis.push([])
      } else {
        lastOpenedEmojis.pop()
      }
    }

    return {
      emoji,
      lastOpenedEmoji,
      paired
    }
  }
}