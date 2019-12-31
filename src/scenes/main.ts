import Phaser from 'phaser'

enum Direction {
  Reset,
  Up,
  Right,
  Down,
  Left
}

export default class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' })
  }

  private size = 3
  private tileSize = 32
  private zoomFactor = 4
  private startX = 0
  private startY = 0
  private spriteX = 0
  private spriteY = 0
  private direction = Direction.Reset

  preload () {
    this.load.spritesheet('emoji', 'assets/sprite-32.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.add.grid(0, this.tileSize / 2, 480, 640, this.tileSize, this.tileSize, 0x000000, 1, 0xffffff, 1)

    for (let column = 0; column < this.size; column++) {
      for (let row = 0; row < this.size; row++) {
        const sprite = this.add.sprite(column * this.tileSize, row * this.tileSize, 'emoji', Phaser.Math.RND.between(0, 5))
          .setDepth(0)
          .setInteractive()

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
    this.spriteX = sprite.x
    this.spriteY = sprite.y
    this.startX = pointer.worldX
    this.startY = pointer.worldY
  }

  onDrag (pointer, sprite, dragX, dragY) {
    const deltaX = (dragX - this.startX) / this.zoomFactor
    const deltaY = (dragY - this.startY) / this.zoomFactor
    const absDeltaX = Math.floor(Math.abs(deltaX))
    const absDeltaY = Math.floor(Math.abs(deltaY))

    if (absDeltaY > absDeltaX) {
      this.direction = deltaY > 0
        ? Direction.Down
        : Direction.Up
    } else if (absDeltaX > absDeltaY) {
      this.direction = deltaX > 0
        ? Direction.Right
        : Direction.Left
    } else {
      this.direction = Direction.Reset
    }

    switch (this.direction) {
      case Direction.Right:
      case Direction.Left: {
        if (absDeltaX > this.tileSize) {
          break
        }

        sprite.x = this.spriteX + deltaX
        sprite.y = this.spriteY
        break
      }
      case Direction.Down:
      case Direction.Up: {
        if (absDeltaY > this.tileSize) {
          break
        }

        sprite.y = this.spriteY + deltaY
        sprite.x = this.spriteX
        break
      }
    }
  }

  onDragEnd (pointer, sprite) {
    sprite.setDepth(0)
    sprite.x = this.spriteX
    sprite.y = this.spriteY
  }
}
