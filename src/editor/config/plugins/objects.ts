import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { nodeNames } from '../../../transformer/node-names'
import { AuxiliaryObjectReference } from '../../../types/models'
import { EditorProps } from '../../Editor'

interface Counter {
  label: string
  index: number
}

type Counters = { [key in TargetNodes]: Counter }

export interface Target {
  type: string
  id: string
  label: string
  caption: string
}

export const objectsKey = new PluginKey('objects')

// TODO: labels for "figure" (parts of a figure panel)

type TargetNodes =
  | 'figure_element'
  | 'table_element'
  | 'equation_element'
  | 'listing_element'

const types: TargetNodes[] = [
  'figure_element',
  'table_element',
  'equation_element',
  'listing_element',
]

const buildTargets = (doc: ProsemirrorNode) => {
  const counters: Counters = types.reduce(
    (output, type) => {
      output[type] = {
        label: nodeNames.get(type)!, // TODO: label from settings?
        index: 0,
      }
      return output
    },
    {} as Counters // tslint:disable-line:no-object-literal-type-assertion
  )

  const buildLabel = (type: TargetNodes) => {
    const counter = counters[type]
    counter.index++
    return `${counter.label} ${counter.index}` // TODO: label from node.attrs.title?
  }

  const targets: Map<string, Target> = new Map()

  doc.descendants(node => {
    if (node.type.name in counters) {
      const label = buildLabel(node.type.name as TargetNodes)

      targets.set(node.attrs.id, {
        type: node.type.name,
        id: node.attrs.id,
        label,
        caption: node.textContent, // TODO: HTML?
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
  const { getModel } = props

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
          const auxiliaryObjectReference = getModel<AuxiliaryObjectReference>(
            node.attrs.rid
          )

          // TODO: handle missing objects?
          // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/395
          if (
            auxiliaryObjectReference &&
            auxiliaryObjectReference.referencedObject
          ) {
            const target = targets.get(
              auxiliaryObjectReference.referencedObject
            )

            if (target && target.label) {
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                label: target.label,
              })

              updated++
            }
          }
        }
      })

      if (updated) {
        return tr.setMeta('addToHistory', false)
      }
    },
  })
}
