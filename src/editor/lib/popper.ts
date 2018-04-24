import Popper, { Placement } from 'popper.js'

export default class PopperManager {
  private activePopper: Popper | null
  private popper: HTMLElement | null

  public show(
    target: Element,
    contents: HTMLElement,
    placement: Placement = 'bottom'
  ) {
    this.destroy()

    this.popper = document.createElement('div')
    this.popper.className = 'popper'
    this.popper.style.display = 'none'

    const arrow = document.createElement('div')
    arrow.className = 'popper-arrow'
    this.popper.appendChild(arrow)

    this.popper.appendChild(contents)

    document.body.appendChild(this.popper) // TODO: re-use this?

    this.popper.style.display = ''
    this.activePopper = new Popper(target, this.popper, { placement })
  }

  public destroy() {
    if (this.activePopper) {
      this.activePopper.destroy()
      this.activePopper = null
    }

    if (this.popper && this.popper.parentNode) {
      this.popper.parentNode.removeChild(this.popper)
    }
  }

  public update() {
    if (this.activePopper) {
      this.activePopper.update()
    }
  }
}
