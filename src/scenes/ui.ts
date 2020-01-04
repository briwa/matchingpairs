import Phaser from 'phaser'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene' })
  }

  private openedEmojis = []
  private scoreText: Phaser.GameObjects.Text

  get score () {
    return this.openedEmojis.length - 1
  }

  init ({ openedEmojis }) {
    this.openedEmojis = openedEmojis
  }

  create () {
    this.scoreText = this.add.text(0, 0, '')
  }

  update () {
    this.scoreText.text = `Score: ${this.score}`
  }
}