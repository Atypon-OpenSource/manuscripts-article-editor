import {
  DOMSerializer,
  Fragment,
  Node as ProsemirrorNode,
  Slice,
} from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import schema from '../../../editor/config/schema'
import { LocalConflicts, StepWithRange } from '../../../lib/conflicts'
import {
  ConflictMerge,
  createMerge,
  iterateConflicts,
} from '../../../lib/merge'
import { Decoder } from '../../../transformer/decode'
import {
  ApplyLocalStep,
  ApplyRemoteStep,
  EditorProps,
  HydratedNodes,
} from '../../Editor'
import PopperManager from '../../lib/popper'

interface ChangeItem {
  pos: [number, number]
  user: number
  index: number
  deletion: boolean
  insertion?: Fragment
}

interface Changes {
  [key: string]: ChangeItem
}

interface Change {
  data: {
    index: number
    user: number
  }
  from: number
  to: number
  pos: number
  slice: Slice
}

const popperManager = new PopperManager()

const serializer = DOMSerializer.fromSchema(schema)

export const conflictsKey = new PluginKey('conflicts')

const icons = {
  toggle: `<svg width="12" height="8" stroke="currentColor"><path d="M2 2l3.942 4L10 2.053" fill="none"/></svg>`,
  accept: '✔',
  reject: '❌',
}

const createDropdownWidget = (
  contents: Fragment | undefined,
  inlineContents: Fragment | undefined,
  handleAccept: () => Promise<void>,
  handleReject: () => Promise<void>
) => {
  const popper = document.createElement('div')
  popper.className = 'conflict-dropdown'

  if (inlineContents) {
    const container = document.createElement('div')
    container.className = 'conflict-option'
    container.addEventListener('click', handleReject)

    const label = document.createElement('div')
    label.className = 'conflict-option-label'
    label.textContent = 'Accept current version'
    container.appendChild(label)

    // TODO: || Fragment.from?
    const node = document.createElement('div')
    node.className = 'conflict-option-contents'
    node.appendChild(serializer.serializeFragment(inlineContents))
    container.appendChild(node)

    popper.appendChild(container)
  }

  if (contents) {
    const container = document.createElement('div')
    container.className = 'conflict-option'
    container.addEventListener('click', handleAccept)

    const label = document.createElement('div')
    label.className = 'conflict-option-label'
    label.textContent = 'Revert to your version'
    container.appendChild(label)

    const node = document.createElement('div')
    node.className = 'conflict-option-contents'
    node.appendChild(serializer.serializeFragment(contents))
    container.appendChild(node)

    popper.appendChild(container)
  }

  const container = document.createElement('span')
  container.className = 'conflict-chevron'
  container.innerHTML = icons.toggle

  const icon = container.firstChild as SVGElement

  const toggleDropdown = () => {
    if (icon.classList.contains('conflict-chevron-open')) {
      popperManager.destroy()
      icon.classList.remove('conflict-chevron-open')
    } else {
      popperManager.show(container, popper, 'bottom-start', false)
      icon.classList.add('conflict-chevron-open')
    }
  }

  container.addEventListener('click', toggleDropdown)

  return container as Node
}

const createAcceptButton = () => {
  const acceptButton = document.createElement('span')
  acceptButton.innerHTML = icons.accept
  acceptButton.className = 'conflict-accept'

  return acceptButton
}

const createDecorationsForConflict = (
  conflictMerge: ConflictMerge,
  documentPosition: number,
  doc: ProsemirrorNode,
  hydratedNodes: HydratedNodes,
  applyLocalStep: ApplyLocalStep,
  applyRemoteStep: ApplyRemoteStep
) => {
  const { conflict, merge, reverseMerge } = conflictMerge

  const { deleted, inserted } = merge.conflictingChanges

  const deletedChanges: Changes = deleted.reduce(
    (acc: Changes, deletion: Change) => {
      acc[`${deletion.data.user}-${deletion.data.index}`] = {
        pos: [deletion.from, deletion.to],
        user: deletion.data.user,
        index: deletion.data.index,
        deletion: true,
      }

      return acc
    },
    {}
  )

  const changes: Changes = inserted.reduce(
    (acc: Changes, insertion: Change) => {
      if (!(`${insertion.data.user}-${insertion.data.index}` in acc)) {
        acc[`${insertion.data.user}-${insertion.data.index}`] = {
          pos: [insertion.pos, insertion.pos],
          user: insertion.data.user,
          index: insertion.data.index,
          deletion: false,
        }
      }

      acc[`${insertion.data.user}-${insertion.data.index}`].insertion =
        insertion.slice.content

      return acc
    },
    deletedChanges
  )

  const isFinalConflict = Object.keys(changes).length === 1

  const items = Object.values(changes).map(change => {
    const fromPos = documentPosition + change.pos[0]
    const toPos = documentPosition + change.pos[1]

    const handleReject = (view: EditorView) => async () => {
      popperManager.destroy()

      await applyLocalStep(conflict, isFinalConflict)

      const tr = view.state.tr

      const mergeResult = merge.apply(change.user, change.index)

      // tslint:disable-next-line:no-any
      mergeResult.tr.steps.forEach((step: StepWithRange) => {
        step.from += documentPosition
        step.to += documentPosition
        tr.step(step)
      })

      view.dispatch(tr)
    }

    const handleAccept = (view: EditorView) => async () => {
      popperManager.destroy()

      const { tr } = reverseMerge.apply(change.user, change.index)

      if (tr.steps.length > 1) {
        throw new Error('Invalid reverse merge')
      }

      const [reverseStep] = tr.steps

      const conflicts = await applyRemoteStep(
        conflict,
        hydratedNodes,
        reverseStep,
        isFinalConflict
      )

      view.dispatch(view.state.tr.setMeta(conflictsKey, conflicts))
    }

    const acceptWidget = Decoration.widget(
      toPos,
      (view: EditorView) => {
        const acceptButton = createAcceptButton()
        acceptButton.addEventListener('click', handleAccept(view))
        return acceptButton
      },
      {
        side: -1,
      }
    )

    const decorations = [
      Decoration.widget(
        fromPos,
        (view: EditorView) => {
          const slice = view.state.tr.doc.slice(fromPos, toPos)

          return createDropdownWidget(
            change.insertion,
            slice.content,
            handleAccept(view),
            handleReject(view)
          )
        },
        {
          side: +1,
        }
      ),
    ]

    if (fromPos !== toPos) {
      decorations.push(
        Decoration.inline(fromPos, toPos, {
          class: 'conflict',
        })
      )
    }

    decorations.push(acceptWidget)

    return decorations
  })

  return ([] as Decoration[]).concat(...items)
}

const decoder = new Decoder(new Map()) // TODO: needs component map?

const createDecorations = (
  conflicts: LocalConflicts,
  doc: ProsemirrorNode,
  applyLocalStep: ApplyLocalStep,
  applyRemoteStep: ApplyRemoteStep
) => {
  const items: Decoration[] = []

  iterateConflicts(
    conflicts,
    doc,
    decoder.decode,
    (current, local, ancestor, pos, conflict) => {
      const conflictMerge = createMerge(current, local, ancestor, conflict)
      const decorations = createDecorationsForConflict(
        conflictMerge,
        pos,
        doc,
        { current, local, ancestor },
        applyLocalStep,
        applyRemoteStep
      )
      items.push(...decorations)
    }
  )

  return DecorationSet.create(doc, items)
}

const hashComponents = (conflicts: LocalConflicts, newState: EditorState) => {
  const { _id, _rev, ...componentConflicts } = conflicts

  if (Object.keys(componentConflicts).length === 0) {
    return null
  }

  // we use the rev of the conflicts for cases when there are conflict
  // decorations and the user accepts remote state
  // i.e. the componentMap doesn't change, but the conflicts do
  let msg = _rev

  // componentMap isn't guaranteed to be up to date with the editor state
  newState.doc.descendants((node: ProsemirrorNode, pos: number) => {
    if (node.attrs && node.attrs.id && node.attrs.id in componentConflicts) {
      msg += JSON.stringify(node.toJSON())
    }
  })

  return msg
}

interface ConflictPluginState {
  conflicts: LocalConflicts | null
  decorations: DecorationSet
  decorationsHash: string | null
}

export default (props: EditorProps) => {
  const { applyLocalStep, applyRemoteStep } = props

  return new Plugin({
    key: conflictsKey,
    state: {
      init: (): ConflictPluginState => {
        return {
          conflicts: null,
          decorations: DecorationSet.empty,
          decorationsHash: null,
        }
      },
      apply: (tr, pluginState, oldState, newState): ConflictPluginState => {
        const conflicts: LocalConflicts = tr.getMeta(conflictsKey)

        const {
          conflicts: existingConflicts,
          decorations,
          decorationsHash,
        } = pluginState as ConflictPluginState

        if (conflicts) {
          // Conflicts have changed
          const conflictsHash = hashComponents(conflicts, newState)

          // Compare with the hash of state (conflicts & components) from
          // when we created the last decorations
          if (conflictsHash === decorationsHash) {
            return pluginState
          }

          return {
            conflicts,
            decorations: createDecorations(
              conflicts,
              newState.doc,
              applyLocalStep,
              applyRemoteStep
            ),
            decorationsHash: conflictsHash,
          }
        }

        if (existingConflicts) {
          // Editor state may have changed, and we may need to recreate
          const conflictsHash = hashComponents(existingConflicts, newState)

          if (conflictsHash !== decorationsHash) {
            return {
              conflicts: existingConflicts,
              decorations: createDecorations(
                existingConflicts,
                newState.doc,
                applyLocalStep,
                applyRemoteStep
              ),
              decorationsHash: conflictsHash,
            }
          }
        }

        // map decorations through transaction
        return {
          conflicts: existingConflicts,
          decorations: decorations.map(tr.mapping, tr.doc),
          decorationsHash,
        }
      },
    },
    props: {
      decorations(state: EditorState) {
        const pluginState = (this as Plugin).getState(state)
        return pluginState.decorations
      },
    },
  })
}
