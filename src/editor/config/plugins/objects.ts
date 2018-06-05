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

export interface Target {
  type: string
  id: string
  label: string
  caption: string
}

export const objectsKey = new PluginKey('objects')

// TODO: figure image

const buildTargets = (doc: ProsemirrorNode) => {
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

  const targets: Map<string, Target> = new Map()

  doc.descendants(node => {
    if (node.type.name in counters) {
      const label = buildLabel(node.type.name)

      targets.set(node.attrs.id, {
        type: node.type.name,
        id: node.attrs.id,
        label,
        caption: node.textContent, // TODO
      })

      // TODO: allow an individual figure to be referenced
      // if (node.attrs.containedObjectIDs) {
      //   node.attrs.containedObjectIDs.forEach((containedObjectID: string) => {
      //     targets.set(containedObjectID, {
      //       type: '',
      //       id: containedObjectID,
      //       label,
      //       caption: '',
      //     })
      //   })
      // }
    }
  })

  return targets
}

export default (props: EditorProps) => {
  const { getComponent } = props

  return new Plugin({
    key: objectsKey,

    state: {
      init: (config, state) => buildTargets(state.doc),
      apply: (tr, old) => {
        // TODO: use decorations to track figure deletion?
        // TODO: map decorations?

        return tr.docChanged ? buildTargets(tr.doc) : old
      },
    },
    props: {
      decorations: state => {
        const targets = objectsKey.getState(state)

        const decorations: Decoration[] = []

        state.doc.descendants((node, pos) => {
          const target = node.attrs.id ? targets.get(node.attrs.id) : null

          if (target) {
            const labelNode = document.createElement('span')
            labelNode.className = 'figure-label'
            labelNode.textContent = target.label + ':'

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
      const targets = objectsKey.getState(newState)

      let updated = 0

      let tr = newState.tr

      newState.doc.descendants((node, pos) => {
        if (node.type.name === 'cross_reference') {
          const auxiliaryObjectReference = getComponent<
            AuxiliaryObjectReference
          >(node.attrs.rid)

          const target = targets.get(auxiliaryObjectReference.referencedObject)

          if (target) {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              label: target.label,
            })

            updated++
          }
        }
      })

      if (updated) {
        return tr.setMeta('addToHistory', false)
      }
    },
  })
}
