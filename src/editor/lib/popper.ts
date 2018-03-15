export const createPopper = (contents: HTMLElement) => {
  const popper = document.createElement('div')
  popper.className = 'popper'
  popper.appendChild(contents)

  const arrow = document.createElement('div')
  arrow.className = 'popper-arrow'
  popper.appendChild(arrow)

  document.body.appendChild(popper)

  return popper
}

export const resizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'
  window.requestAnimationFrame(() => {
    textarea.style.height = textarea.scrollHeight + 'px'
  })
}
