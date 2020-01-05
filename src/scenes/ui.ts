import Phaser from 'phaser'
import MainScene from './main'
import Overlay from '../sprites/overlay'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene' })
  }

  private parent: MainScene
  private winOverlay: Overlay
  private loseOverlay: Overlay
  private timer: Phaser.Time.TimerEvent
  private progressBar: Phaser.GameObjects.Graphics

  get score () {
    if (!this.parent) {
      return 0
    }

    return this.parent.level.openedTiles.length - 1
  }

  init ({ parent }) {
    this.parent = parent
  }

  resetTimer () {
    this.timer = this.time.delayedCall(Math.pow(this.parent.size, 2) / 2 * 4000, () => {
      this.loseOverlay.setVisible(true)
    })
  }

  create () {
    this.winOverlay = new Overlay(this, 'You win!\n Tap anywhere to play again.')
    this.loseOverlay = new Overlay(this, 'You lose!\n Tap anywhere to play again.')
      .setVisible(false)

    this.progressBar = this.add.graphics()

    this.winOverlay.on('pointerdown', () => this.parent.resetLevel())
    this.loseOverlay.on('pointerdown', () => {
      this.parent.resetLevel()
      this.resetTimer()
      this.loseOverlay.setVisible(false)
    })

    this.resetTimer()
  }

  update () {
    this.winOverlay.setVisible((this.parent.size * 2) === this.score)

    if (this.timer) {
      this.progressBar.clear()
      this.progressBar
        .fillStyle(0xffffff)
        .fillRect(0, 0, (1 - this.timer.getProgress()) * 480, 16)
    }
  }
}