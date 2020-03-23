import * as Phaser from 'phaser'

export default class GameState extends Phaser.Plugins.BasePlugin {
  public hey = 'whatsup'

  constructor (pluginManager) {
    super(pluginManager)
  }
}
