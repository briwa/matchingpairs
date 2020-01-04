import Phaser from 'phaser'
import MainScene from './main'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene' })
  }

  private parent: MainScene
  private overlay: Phaser.GameObjects.Group
  private overlayTextStyle = {
    font: '30px',
    fill: '#000000'
  }

  get score () {
    return this.parent.openedEmojis.length - 1
  }

  init ({ parent }) {
    this.parent = parent
  }

  create () {
    const overlay = this.add.rectangle(0, 0, 480, 640, 0xffffff).setOrigin(0, 0)
    const overlayText = this.add.text(0, 0, 'You win!', this.overlayTextStyle)
    const playAgain = this.add.text(0, 0, 'Tap here to play again.', this.overlayTextStyle).setInteractive()
    Phaser.Display.Align.In.Center(overlayText, overlay)
    Phaser.Display.Align.In.Center(playAgain, overlay)
    playAgain.y += 45

    this.overlay = this.add.group([overlay, overlayText, playAgain])

    playAgain.on('pointerdown', () => {
      this.parent.resetLevel()
    })
  }

  update () {
    this.overlay.setVisible((this.parent.size * 2) === this.score)
  }
}