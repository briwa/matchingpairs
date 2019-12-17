import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  create () {
    this.add.text(350, 190, 'Hello world!')
  }
}
