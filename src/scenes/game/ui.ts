import Phaser from 'phaser'
import Overlay from '../../sprites/overlay'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene', active: false })
  }

  private readonly msPerPair = 4000
  private score = 0
  private maxScore = 0
  private winOverlay: Overlay
  private loseOverlay: Overlay
  private timer: Phaser.Time.TimerEvent
  private progressBar: Phaser.GameObjects.Graphics

  private get timerProgress () {
    if (!this.timer) {
      return 0
    }

    return this.timer.getProgress()
  }

  init () {
    this.events.on('score', ({ score }) => {
      this.score = score
    })

    this.events.on('start', ({ maxScore }) => {
      this.score = 0
      this.maxScore = maxScore

      if (this.timer) {
        this.timer.remove()
      }

      this.timer = this.time.addEvent({ delay: this.maxScore * this.msPerPair })
    })
  }

  create () {
    this.winOverlay = new Overlay(this, 'You *win*!\n Tap anywhere \nto play again.')
    this.loseOverlay = new Overlay(this, 'You lose...\n Tap anywhere \nto play again.')
    this.progressBar = this.add.graphics()

    this.winOverlay.on('pointerdown', () => this.events.emit('reset'))
    this.loseOverlay.on('pointerdown', () => this.events.emit('reset'))
  }

  update () {
    this.winOverlay.setVisible(this.maxScore === (this.score * 2))
    this.loseOverlay.setVisible(this.timerProgress === 1)

    this.progressBar.clear()
    this.progressBar
      .fillStyle(0xffffff)
      .fillRect(0, 0, (1 - this.timerProgress) * 480, 16)
  }
}