import ModalBaseScene from './index'

export default class ModalCreditsScene extends ModalBaseScene {
  constructor () {
    super({
      key: 'ModalCreditsScene',
      width: 380
    })
  }

  private static readonly TWEMOJI_LICENSE = 'Twemoji graphics made by Twitter and other contributors,'
    + '\nlicensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/'

  onCreated () {
    const title = this.add.text(0, 0, 'Credits', {
      fontFamily: 'Maven Pro',
      fontSize: '40px',
      color: '#000000'
    })
    const twemoji = this.add.text(0, 40, ModalCreditsScene.TWEMOJI_LICENSE, {
      fontFamily: 'Maven Pro',
      fontSize: '10px',
      align: 'left',
      fill: '#000000'
    })

    this.modal.add([title, twemoji])

    Phaser.Display.Align.In.TopCenter(title, this.body, 0, -ModalBaseScene.MARGIN.y)
    Phaser.Display.Align.In.TopCenter(twemoji, this.body, 0, -60)
  }
}