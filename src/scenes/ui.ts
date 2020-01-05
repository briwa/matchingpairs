import Phaser from 'phaser'
import MainScene from './main'
import Overlay from '../sprites/overlay'

export default class UIScene extends Phaser.Scene {
  constructor () {
    super({ key: 'UIScene' })
  }

  private parent: MainScene
  private overlay: Phaser.GameObjects.Container

  get score () {
    if (!this.parent) {
      return 0
    }

    return this.parent.level.openedTileIndices.length - 1
  }

  init ({ parent }) {
    this.parent = parent
  }

  create () {
    this.overlay = new Overlay(this)
    this.overlay.on('pointerdown', () => this.parent.resetLevel())
  }

  update () {
    this.overlay.setVisible((this.parent.size * 2) === this.score)
  }
}