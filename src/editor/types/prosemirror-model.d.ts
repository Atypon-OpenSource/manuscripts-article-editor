import { Mark } from 'prosemirror-model'

// TODO: remove this once the official types are corrected

declare module 'prosemirror-model' {
  interface MarkType {
    isInSet(set: Mark[]): boolean
  }
}
