interface StyledNodeAttrs {
  paragraphStyle?: string
}

export const buildElementClass = (attrs: StyledNodeAttrs) => {
  const classes = ['MPElement']

  if (attrs.paragraphStyle) {
    classes.push(attrs.paragraphStyle.replace(/:/g, '_'))
  }

  return classes.join(' ')
}
