import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import listKeymap from './list'
import miscKeymap from './misc'
import titleKeymap from './title'

export default [
  keymap(miscKeymap),
  keymap(titleKeymap),
  keymap(baseKeymap),
  keymap(listKeymap),
]
