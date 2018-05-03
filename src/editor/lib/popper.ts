import Popper, { Placement } from 'popper.js'

export default class PopperManager {
  private activePopper: Popper | null
  private container: HTMLElement | null

  public show(
    target: Element,
    contents: HTMLElement,
    placement: Placement = 'bottom'
  ) {
    if (this.activePopper) {
      return this.destroy()
    }

    window.requestAnimationFrame(() => {
      this.container = document.createElement('div')
      this.container.className = 'popper'

      const arrow = document.createElement('div')
      arrow.className = 'popper-arrow'
      this.container.appendChild(arrow)

      this.container.appendChild(contents)
      document.body.appendChild(this.container)

      this.activePopper = new Popper(target, this.container, {
        placement,
        removeOnDestroy: true,
      })
    })
  }

  public destroy() {
    if (this.activePopper) {
      this.activePopper.destroy()
      this.activePopper = null
    }
  }

  public update() {
    if (this.activePopper) {
      this.activePopper.update()
    }
  }
}
