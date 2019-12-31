import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  private size = 3
  private tileSize = 32
  private zoomFactor = 4
  private startX = 0
  private startY = 0

  preload () {
    this.load.spritesheet('emoji', 'assets/sprite-32.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.add.grid(0, this.tileSize / 2, 480, 640, this.tileSize, this.tileSize, 0x000000, 1, 0xffffff, 1)

    for (let column = 0; column < this.size; column++) {
      for (let row = 0; row < this.size; row++) {
        const sprite = this.add.sprite(column * this.tileSize, row * this.tileSize, 'emoji', Phaser.Math.RND.between(0, 1))
        sprite.setDepth(0)
        sprite.setInteractive()
        this.input.setDraggable(sprite)
      }
    }

    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.input.on('dragstart', this.onDragStart.bind(this))
    this.input.on('drag', this.onDrag.bind(this))
    this.input.on('dragend', this.onDragEnd.bind(this))
  }

  onDragStart (pointer, sprite,  dragX, dragY) {
    sprite.setDepth(1)
    this.startX = pointer.worldX
    this.startY = pointer.worldY
  }

  onDrag (pointer, sprite, dragX, dragY) {
    const deltaX = (dragX - this.startX) / this.zoomFactor
    const deltaY = (dragY - this.startY) / this.zoomFactor
    sprite.x = this.startX + deltaX
    sprite.y = this.startY + deltaY
  }

  onDragEnd (pointer, sprite) {
    sprite.setDepth(0)
    this.startX = 0
    this.startY = 0
  }
}
