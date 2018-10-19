import {
  Merge,
  mergeTransforms,
  recreateTransform,
} from '@manuscripts/prosemirror-recreate-steps'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Transform } from 'prosemirror-transform'
import { LocalConflicts } from '../lib/conflicts'
import { Model } from '../types/models'
import { Conflict } from './conflicts'

export interface ConflictMerge {
  conflict: Conflict
  merge: Merge
  reverseMerge: Merge
  reverseTr: Transform
  tr: Transform
}

export const createMerge = (
  currentNode: ProsemirrorNode,
  localNode: ProsemirrorNode,
  ancestorNode: ProsemirrorNode,
  conflict: Conflict
): ConflictMerge => {
  const wordDiffs = true
  const complexSteps = true

  // change from local parent to current state
  const transform1 = recreateTransform(
    ancestorNode,
    currentNode,
    complexSteps,
    wordDiffs
  )

  // the local change
  const transform2 = recreateTransform(
    ancestorNode,
    localNode,
    complexSteps,
    wordDiffs
  )

  // disabled because it is broken in some edge cases
  const automerge = false
  const rebase = true

  const { merge, tr } = mergeTransforms(
    transform1,
    transform2,
    automerge,
    rebase,
    wordDiffs
  )

  const { merge: reverseMerge, tr: reverseTr } = mergeTransforms(
    transform2,
    transform1,
    automerge,
    rebase,
    wordDiffs
  )

  return { conflict, merge, reverseMerge, reverseTr, tr }
}

export const hydrateConflictNodes = (
  conflict: Conflict,
  decode: (model: Model) => ProsemirrorNode | null
) => {
  const { local, ancestor } = conflict
  const localNode = decode(local as Model)
  const ancestorNode = decode(ancestor as Model)

  if (localNode === null || ancestorNode === null) {
    throw new Error('Failed to decode node')
  }

  return { localNode, ancestorNode }
}

export type ConflictNodeIterator = (
  currentNode: ProsemirrorNode,
  localNode: ProsemirrorNode,
  ancestorNode: ProsemirrorNode,
  pos: number,
  conflict: Conflict
) => void

export const iterateConflicts = (
  conflicts: LocalConflicts,
  doc: ProsemirrorNode,
  decode: (model: Model) => ProsemirrorNode | null,
  fn: ConflictNodeIterator
) => {
  doc.descendants((node: ProsemirrorNode, pos: number) => {
    if (!(node.attrs && node.attrs.id && node.attrs.id in conflicts)) {
      return
    }

    for (const conflict of Object.values(conflicts[node.attrs.id])) {
      const { localNode, ancestorNode } = hydrateConflictNodes(conflict, decode)
      fn(node, localNode, ancestorNode, pos + 1, conflict)
    }
  })
}
