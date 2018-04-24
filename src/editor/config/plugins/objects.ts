import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { AuxiliaryObjectReference } from '../../../types/components'
import { EditorProps } from '../../Editor'
import { StringMap } from '../types'

interface Counter {
  index: number
  label: string
}

export const objectsKey = new PluginKey('objects')

// TODO: figure image

const buildLabels = (doc: ProsemirrorNode) => {
  const counters: StringMap<Counter> = {
    figure: {
      index: 0,
      label: 'Figure',
    },
    table_figure: {
      index: 0,
      label: 'Table',
    },
  }

  const buildLabel = (type: string) => {
    const counter = counters[type]
    counter.index++
    return `${counter.label} ${counter.index}`
  }

  const targetLabels: Map<string, string> = new Map()

  doc.descendants(node => {
    if (node.type.name in counters) {
      const label = buildLabel(node.type.name)

      targetLabels.set(node.attrs.id, label)

      // TODO: allow an individual figure to be referenced
      if (node.attrs.containedObjectIDs) {
        node.attrs.containedObjectIDs.forEach((containedObjectID: string) => {
          targetLabels.set(containedObjectID, label)
        })
      }
    }
  })

  return targetLabels
}

export default (props: EditorProps) => {
  const { getComponent } = props

  return new Plugin({
    key: objectsKey,

    state: {
      init: (config, state) => buildLabels(state.doc),
      apply: (tr, old) => {
        // TODO: use decorations to track figure deletion?
        // TODO: map decorations?

        return tr.docChanged ? buildLabels(tr.doc) : old
      },
    },
    props: {
      decorations: state => {
        const targetLabels = objectsKey.getState(state)

        const decorations: Decoration[] = []

        state.doc.descendants((node, pos) => {
          const label = node.attrs.id ? targetLabels.get(node.attrs.id) : null

          if (label) {
            const labelNode = document.createElement('span')
            labelNode.className = 'figure-label'
            labelNode.textContent = targetLabels.get(node.attrs.id) + ':'

            node.forEach((child, offset) => {
              if (child.type.name === 'figcaption') {
                decorations.push(
                  Decoration.widget(pos + 1 + offset + 1, labelNode, {
                    side: -1,
                  })
                )
              }
            })
          }
        })

        return DecorationSet.create(state.doc, decorations)
      },
    },
    appendTransaction: (transactions, oldState, newState) => {
      const targetLabels = objectsKey.getState(newState)

      let updated = 0

      let tr = newState.tr

      newState.doc.descendants((node, pos) => {
        if (node.type.name === 'cross_reference') {
          const auxiliaryObjectReference = getComponent<
            AuxiliaryObjectReference
          >(node.attrs.rid)

          const label = targetLabels.get(
            auxiliaryObjectReference.referencedObject
          )

          if (label) {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              label,
            })

            updated++
          }
        }
      })

      if (updated) {
        return tr
      }
    },
  })
}
