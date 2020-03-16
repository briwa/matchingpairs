import Phaser from 'phaser'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../helpers/constants'
import Button from '../../objects/button'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene', active: true })
  }

  private static readonly MARGIN = { y: 20 }
  private score = 0
  private maxScore = 0
  private timer: Phaser.Time.TimerEvent
  private progressBar: Phaser.GameObjects.Graphics
  private modal: Phaser.Scene
  private back: Button

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
    this.modal = this.scene.get('ModalGenericScene')
    this.modal.events.on('ok', this.goBackHome.bind(this))

    this.back = new Button({
      scene: this,
      label: 'back',
      variant: 'secondary'
    })
    this.back.setX(CANVAS_WIDTH / 2 - (this.back.width / 2))
    this.back.setY(CANVAS_HEIGHT - this.back.height - UIScene.MARGIN.y)
    this.back.on('pointerdown', this.goBackHome.bind(this))

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

      const totalTime = maxScore * (Math.sqrt(maxScore) / 2 * 1000)
      this.timer = this.time.delayedCall(totalTime, () => {
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
    this.back.setVisible(this.timerProgress !== 1)
  }

  private goBackHome () {
    this.events.emit('home')

    if (this.timer) {
      this.timer.remove()
    }
  }
}