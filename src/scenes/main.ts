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
  private dragging = {
    x: 0,
    y: 0,
    sprite: {
      x: 0,
      y: 0,
      tileX: 0,
      tileY: 0
    },
    adjacent: {
      [Direction.Up]: null,
      [Direction.Right]: null,
      [Direction.Down]: null,
      [Direction.Left]: null
    }
  }
  private direction = Direction.Reset
  private level: Phaser.GameObjects.Sprite[][] = []

  preload () {
    this.load.spritesheet('emoji', 'assets/sprite-32.png', { frameWidth: this.tileSize, frameHeight: this.tileSize })
  }

  create () {
    this.add.grid(0, this.tileSize / 2, 480, 640, this.tileSize, this.tileSize, 0x000000, 1, 0xffffff, 1)

    for (let column = 0; column < this.size; column++) {
      const spriteRow = []
      for (let row = 0; row < this.size; row++) {
        const sprite = this.add.sprite(column * this.tileSize, row * this.tileSize, 'emoji', row + (column * this.size))
          .setDepth(0)
          .setInteractive()

        this.input.setDraggable(sprite)
        spriteRow.push(sprite)
      }

      this.level.push(spriteRow)
    }

    this.cameras.main.centerOn(this.tileSize / 2 * (this.size - 1), this.tileSize / 2 * (this.size - 1)).setZoom(this.zoomFactor)
    this.input.on('dragstart', this.onDragStart.bind(this))
    this.input.on('drag', this.onDrag.bind(this))
    this.input.on('dragend', this.onDragEnd.bind(this))
  }

  onDragStart (pointer, sprite,  dragX, dragY) {
    sprite.setDepth(1)
    this.dragging.sprite.x = sprite.x
    this.dragging.sprite.y = sprite.y
    this.dragging.sprite.tileX = Math.floor(sprite.x / this.tileSize)
    this.dragging.sprite.tileY = Math.floor(sprite.y / this.tileSize)

    const currentColumn = this.level[this.dragging.sprite.tileX]
    const nextColumn = this.level[this.dragging.sprite.tileX + 1]
    const previousColumn = this.level[this.dragging.sprite.tileX - 1]

    const adjacentUp = currentColumn[this.dragging.sprite.tileY - 1]
    if (adjacentUp) {
      this.dragging.adjacent[Direction.Up] = {
        x: adjacentUp.x,
        y: adjacentUp.y,
        sprite: adjacentUp
      }
    } else {
      this.dragging.adjacent[Direction.Up] = null
    }

    const adjacentRight = nextColumn && nextColumn[this.dragging.sprite.tileY]
    if (adjacentRight) {
      this.dragging.adjacent[Direction.Right] = {
        x: adjacentRight.x,
        y: adjacentRight.y,
        sprite: adjacentRight
      }
    } else {
      this.dragging.adjacent[Direction.Right] = null
    }

    const adjacentDown = currentColumn[this.dragging.sprite.tileY + 1]
    if (adjacentDown) {
      this.dragging.adjacent[Direction.Down] = {
        x: adjacentDown.x,
        y: adjacentDown.y,
        sprite: adjacentDown
      }
    } else {
      this.dragging.adjacent[Direction.Down] = null
    }

    const adjacentLeft = previousColumn && previousColumn[this.dragging.sprite.tileY]
    if (adjacentLeft) {
      this.dragging.adjacent[Direction.Left] = {
        x: adjacentLeft.x,
        y: adjacentLeft.y,
        sprite: adjacentLeft
      }
    } else {
      this.dragging.adjacent[Direction.Left] = null
    }

    this.dragging.x = pointer.worldX
    this.dragging.y = pointer.worldY
  }

  onDrag (pointer, sprite, dragX, dragY) {
    const deltaX = (dragX - this.dragging.x) / this.zoomFactor
    const deltaY = (dragY - this.dragging.y) / this.zoomFactor
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

    const adjacent = this.dragging.adjacent[this.direction]
    if (absDeltaX > this.tileSize || absDeltaY > this.tileSize || !adjacent) {
      return
    }

    let deltaFinal
    switch (this.direction) {
      case Direction.Right:
      case Direction.Left: {
        sprite.x = this.dragging.sprite.x + deltaX
        sprite.y = this.dragging.sprite.y

        deltaFinal = absDeltaX
        break
      }
      case Direction.Down:
      case Direction.Up: {
        sprite.y = this.dragging.sprite.y + deltaY
        sprite.x = this.dragging.sprite.x

        deltaFinal = absDeltaY
        break
      }
    }

    if (deltaFinal / this.tileSize > 0.5) {
      adjacent.sprite.x = this.dragging.sprite.x
      adjacent.sprite.y = this.dragging.sprite.y
    } else {
      adjacent.sprite.x = adjacent.x
      adjacent.sprite.y = adjacent.y
    }
  }

  onDragEnd (pointer, sprite) {
    sprite.setDepth(0)
    sprite.x = this.dragging.sprite.x
    sprite.y = this.dragging.sprite.y

    const adjacent = this.dragging.adjacent[this.direction]
    adjacent.sprite.x = adjacent.x
    adjacent.sprite.y = adjacent.y
  }
}
