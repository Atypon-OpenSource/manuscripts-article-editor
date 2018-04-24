import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorProps } from '../../Editor'

export const componentsKey = new PluginKey('components')

export const INSERT = 'INSERT'
export const UPDATE = 'UPDATE'
export const REMOVE = 'REMOVE'

export default (props: EditorProps) => {
  const { getComponent, saveComponent, deleteComponent } = props

  return new Plugin({
    key: componentsKey,

    state: {
      init: () => {
        return {
          getComponent,
          saveComponent,
          deleteComponent,
        }
      },
      apply: (transaction, pluginState) => {
        const meta = transaction.getMeta(componentsKey)

        if (meta) {
          if (meta[INSERT]) {
            meta[INSERT].forEach(saveComponent)
          }

          if (meta[UPDATE]) {
            meta[UPDATE].forEach(saveComponent)
          }

          if (meta[REMOVE]) {
            meta[REMOVE].forEach(deleteComponent)
          }
        }

        return pluginState
      },
    },
  })
}
