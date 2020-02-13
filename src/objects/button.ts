import Phaser from 'phaser'

interface Config {
  scene: Phaser.Scene
  label: string
  variant?: 'primary' | 'secondary'
  size?: 'lg' | 'md' | 'sm'
}

export default class Button extends Phaser.GameObjects.Container {
  private static variants = {
    primary: {
      text: {
        fontFamily: '"Didact Gothic", Arial',
        align: 'center',
        fill: '#000000'
      },
      button: {
        fill: 0xcccccc
      }
    }
  }

  private static size = {
    md: {
      text: {
        fontSize: '25px'
      },
      button: {
        paddingH: 30,
        paddingV: 16
      }
    },
    lg: {
      text: {
        fontSize: '36px'
      },
      button: {
        paddingH: 40,
        paddingV: 20
      }
    }
  }

  private static getStyle (variant: Config['variant'] = 'primary', size: Config['size'] = 'md') {
    const variantStyle = Button.variants[variant]
    if (!variantStyle) {
      throw new Error (`Invalid variant: ${variant}`)
    }

    const sizeStyle = Button.size[size]
    if (!sizeStyle) {
      throw new Error (`Invalid size: ${size}`)
    }

    return {
      text: {
        ...variantStyle.text,
        ...sizeStyle.text
      },
      button: {
        ...variantStyle.button,
        ...sizeStyle.button
      }
    }
  }

  constructor ({ scene, label, variant, size }: Config) {
    super(scene, 0, 0)
    this.scene.add.existing(this)

    const style = Button.getStyle(variant, size)
    const text = this.scene.add.text(style.button.paddingH / 2, style.button.paddingV / 2, label, style.text)
    const buttonWidth = text.width + style.button.paddingH
    const buttonHeight = text.height + style.button.paddingV

    const graphics = new Phaser.GameObjects.Graphics(scene)
    graphics.fillStyle(style.button.fill, 1)
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6)

    this.add([graphics, text])
    this.setSize(buttonWidth, buttonHeight)
      .setInteractive(new Phaser.Geom.Rectangle(buttonWidth / 2, buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
  }
}