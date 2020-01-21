import Phaser from 'phaser'
import Overlay from '../sprites/overlay'

export default class HomeScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HomeScene' })
  }

  create () {
    const overlay = new Overlay(this, 'Matching pairs!\n Tap anywhere\nto play.')
    overlay.on('pointerdown', () => {
      this.scene.setActive(false, 'HomeScene')
      this.scene.setActive(true, 'GameScene')
      this.scene.switch('GameScene')
    })
  }
}
