import Phaser from 'phaser'
import { CANVAS_WIDTH } from '../../helpers/constants'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene', active: true })
  }

  private readonly msPerPair = 2000
  private score = 0
  private maxScore = 0
  private timer: Phaser.Time.TimerEvent
  private progressBar: Phaser.GameObjects.Graphics
  private modal: Phaser.Scene

  private get timerProgress () {
    if (!this.timer) {
      return 1
    }

    return this.timer.getProgress()
  }

  private get isWinning () {
    return this.maxScore === (this.score * 2)
  }

  create () {
    this.progressBar = this.add.graphics()
    this.modal = this.scene.get('ModalScene')
    this.modal.events.on('ok', () => {
      this.events.emit('home')

      if (this.timer) {
        this.timer.remove()
      }
    })

    this.events.on('score', ({ score }) => {
      this.score = score

      if (this.isWinning) {
        this.timer.paused = true
        this.modal.events.emit('show', {
          text: 'You win!'
        })
      }
    })

    this.events.on('start-level', ({ maxScore }) => {
      this.score = 0
      this.maxScore = maxScore

      this.timer = this.time.delayedCall(maxScore * this.msPerPair, () => {
        this.modal.events.emit('show', {
          text: 'You lose...'
        })
      })
    })
  }

  update () {
    this.progressBar.clear()
    this.progressBar
      .fillStyle(0xcccccc)
      .fillRect(0, 0, (1 - this.timerProgress) * CANVAS_WIDTH, 16)
  }
}