import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  private size = 3
  private tileSize = 32

  preload () {
    this.load.spritesheet('emoji', 'assets/sprite-32.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.add.grid(0, this.tileSize / 2, 480, 640, this.tileSize, this.tileSize, 0x000000, 1, 0xffffff, 1)

    for (let column = 0; column < this.size; column++) {
      for (let row = 0; row < this.size; row++) {
        this.add.sprite(column * this.tileSize, row * this.tileSize, 'emoji', row + (column * this.size))
      }
    }

    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(2)
  }
}
