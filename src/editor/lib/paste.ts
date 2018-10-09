import { Slice } from 'prosemirror-model'

const removeFirstParagraphIfEmpty = (slice: Slice) => {
  const firstChild = slice.content.firstChild

  if (
    firstChild &&
    firstChild.type.name === 'paragraph' &&
    firstChild.textContent === ''
  ) {
    slice.content = slice.content.cut(firstChild.nodeSize)
  }
}

export const transformPasted = (slice: Slice): Slice => {
  removeFirstParagraphIfEmpty(slice)

  return slice
}
