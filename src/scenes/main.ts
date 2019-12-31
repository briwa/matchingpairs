import Phaser from 'phaser'
import Emoji from '../sprites/emoji'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  private size = 8
  private tileSize = 32
  private zoomFactor = 1.5
  private level: Emoji[][] = []

  preload () {
    // 42 columns * 44 rows
    // https://github.com/Deveo/emojione-png-sprites
    this.load.spritesheet('emoji', 'assets/sprite-32.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    for (let column = 0; column < this.size; column++) {
      const spriteRow = []
      for (let row = 0; row < this.size; row++) {
        const sprite = new Emoji({
          scene: this,
          x: column * this.tileSize,
          y: row * this.tileSize,
          frame: 1802
        })

        spriteRow.push(sprite)
      }

      this.level.push(spriteRow)
    }

    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.input.on('pointerdown', this.onPointerDown.bind(this))
  }

  onPointerDown (pointer, sprites,  dragX, dragY) {
    const sprite = sprites[0]
    sprite.toggle()
  }
}
