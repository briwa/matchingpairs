import Phaser from 'phaser'
import Game from '../index'
import Button from '../objects/button'

export default class UI extends Phaser.Scene {
  private static readonly MARGIN = { y: 5 }
  private score = 0
  private maxScore = 0
  private speed = 0
  private timer: Phaser.Time.TimerEvent
  private progressBar: Phaser.GameObjects.Graphics
  private modal: Phaser.Scene
  private back: Button

  constructor () {
    super({ key: 'UI', active: true })
  }

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
    this.modal = this.scene.get('ModalGeneric')
    this.modal.events.on('ok', this.goBackHome.bind(this))

    this.back = new Button({
      scene: this,
      label: 'back',
      variant: 'secondary'
    })
    this.back.setX(Game.CANVAS_WIDTH / 2 - (this.back.width / 2))
    this.back.setY(Game.CANVAS_HEIGHT - this.back.height - UI.MARGIN.y)
    this.back.on('pointerdown', this.goBackHome.bind(this))

    this.events.on('score', ({ score }) => {
      this.score = score

      if (this.isWinning) {
        this.timer.paused = true
        this.modal.events.emit('show', {
          text: 'You win!'
        })
      } else {
        this.resetTimer()
      }
    })

    this.events.on('start-level', ({ maxScore, speed }) => {
      this.score = 0
      this.maxScore = maxScore
      this.speed = speed
      this.resetTimer()
    })
  }

  update () {
    this.progressBar.clear()
    this.progressBar
      .fillStyle(0xcccccc)
      .fillRect(0, 0, (1 - this.timerProgress) * Game.CANVAS_WIDTH, 16)
    this.back.setVisible(this.timerProgress !== 1)
  }

  private goBackHome () {
    this.events.emit('home')

    if (this.timer) {
      this.timer.remove()
    }
  }

  private resetTimer () {
    if (this.timer) {
      this.timer.remove()
    }

    if (!this.speed) {
      return
    }

    const totalTime = (this.maxScore - (this.score * 2)) * this.speed
    this.timer = this.time.delayedCall(totalTime, () => {
      this.modal.events.emit('show', {
        text: 'You lose...'
      })
    })
  }
}