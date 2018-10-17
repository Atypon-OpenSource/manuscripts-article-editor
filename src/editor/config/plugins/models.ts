import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorProps } from '../../Editor'

export const modelsKey = new PluginKey('models')

export const INSERT = 'INSERT'
export const UPDATE = 'UPDATE'
export const REMOVE = 'REMOVE'

export default (props: EditorProps) => {
  const { getModel, saveModel, deleteModel } = props

  return new Plugin({
    key: modelsKey,

    state: {
      init: () => {
        return {
          getModel,
          saveModel,
          deleteModel,
        }
      },
      apply: (transaction, pluginState) => {
        const meta = transaction.getMeta(modelsKey)

        if (meta) {
          if (meta[INSERT]) {
            meta[INSERT].forEach(saveModel)
          }

          if (meta[UPDATE]) {
            meta[UPDATE].forEach(saveModel)
          }

          if (meta[REMOVE]) {
            meta[REMOVE].forEach(deleteModel)
          }
        }

        return pluginState
      },
    },
  })
}
