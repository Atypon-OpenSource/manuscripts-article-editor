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

// remove `id` from pasted content
const removeIDs = (slice: Slice) => {
  slice.content.descendants(node => {
    if (node.attrs.id) {
      node.attrs.id = null
    }
  })
}

export const transformPasted = (slice: Slice): Slice => {
  removeFirstParagraphIfEmpty(slice)

  removeIDs(slice)

  return slice
}
