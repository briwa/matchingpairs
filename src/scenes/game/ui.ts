import Phaser from 'phaser'
import Overlay from '../../objects/overlay'
import { CANVAS_WIDTH } from '../../helpers/constants'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene', active: false })
  }

  private readonly msPerPair = 2000
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

  private get isWinning () {
    return this.maxScore === (this.score * 2)
  }

  init () {
    this.events.on('score', ({ score }) => {
      this.score = score

      if (this.isWinning) {
        this.timer.remove()
      }
    })

    this.events.on('start-level', ({ maxScore }) => {
      this.score = 0
      this.maxScore = maxScore

      if (this.timer) {
        this.timer.remove()
      }

      this.timer = this.time.addEvent({ delay: maxScore * this.msPerPair })
    })
  }

  create () {
    this.winOverlay = new Overlay(this, 'You *win*!\n Tap anywhere \nto play again.')
    this.loseOverlay = new Overlay(this, 'You lose...\n Tap anywhere \nto play again.')
    this.progressBar = this.add.graphics()

    this.winOverlay.on('pointerdown', () => this.events.emit('reset-level'))
    this.loseOverlay.on('pointerdown', () => this.events.emit('reset-level'))
  }

  update () {
    this.winOverlay.setVisible(this.isWinning)
    this.loseOverlay.setVisible(this.timerProgress === 1 && !this.isWinning)

    this.progressBar.clear()
    this.progressBar
      .fillStyle(0xffffff)
      .fillRect(0, 0, (1 - this.timerProgress) * CANVAS_WIDTH, 16)
  }
}