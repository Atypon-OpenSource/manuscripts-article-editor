import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Step } from 'prosemirror-transform'
import { RxCollection } from 'rxdb'
import RxDB from 'rxdb/plugins/core'
import {
  ApplyLocalStep,
  ApplyRemoteStep,
  HydratedNodes,
} from '../editor/Editor'
import { ComponentConflicts, LocalConflicts } from '../lib/conflicts'
import { modelFromNode } from '../transformer/encode'
import { PARAGRAPH } from '../transformer/object-types'
import { Model, Paragraph, ParagraphElement } from '../types/models'

interface PouchOpenRevsDoc {
  _revisions: {
    ids: string[]
    start: number
  }
  _id: string
  _rev: string
  manuscriptID?: string
  objectType?: string
}

export interface PouchOpenRevsResult {
  ok?: PouchOpenRevsDoc
  missing?: string
}

export interface ConflictingRevision {
  id: string
  rev: string
}

export interface Conflict<T = {}> {
  id: string
  ancestor: PouchOpenRevsDoc & T
  local: PouchOpenRevsDoc & T
  remote: PouchOpenRevsDoc & T
}

export interface ComponentConflicts {
  [conflictID: string]: Conflict
}

export type LocalConflicts = {
  [componentID: string]: ComponentConflicts
} & {
  _id: string
  _rev: string
}

export interface StepWithRange extends Step {
  from: number
  to: number
}

export const getRevNumber = (rev: string | undefined): number => {
  if (!rev) {
    throw new Error('Invalid rev string')
  }
  const match = rev.match(/(\d+)-/)
  if (!match || !match[1]) {
    throw new Error('Unable to parse _rev number')
  }
  return Number(match[1])
}

export const getLocalConflictDoc = async (
  collection: RxCollection<{}>,
  manuscriptID: string
) => {
  let localDoc = await collection.getLocal(manuscriptID)

  if (!localDoc) {
    localDoc = await collection.insertLocal(manuscriptID, {})
  }

  return localDoc.toJSON() as LocalConflicts
}

export const saveConflictLocally = async (
  collection: RxCollection<Model>,
  conflict: Conflict
) => {
  const { manuscriptID, _id } = conflict.local

  if (!manuscriptID) {
    // TODO: components that could conflict but don't have a manuscriptID
    throw new Error('No manuscriptID')
  }

  const localDoc = await getLocalConflictDoc(collection, manuscriptID)

  const existingConflicts: ComponentConflicts = localDoc[_id] || {}

  if (conflict.id in existingConflicts) {
    throw new Error('Duplicate conflict')
  }

  const updatedDoc: LocalConflicts = {
    ...localDoc,
    [_id]: {
      ...existingConflicts,
      [conflict.id]: conflict,
    },
  }

  return collection.upsertLocal(manuscriptID, updatedDoc)
}

export const removeConflictLocally = async (
  collection: RxCollection<Model>,
  conflict: Conflict
) => {
  const { manuscriptID, _id: componentID } = conflict.local

  if (!manuscriptID) {
    // TODO: components that could conflict but don't have a manuscriptID
    throw new Error('No manuscriptID')
  }

  const localDoc = await getLocalConflictDoc(collection, manuscriptID)

  const componentConflicts = localDoc[componentID] || {}

  if (!(conflict.id in componentConflicts)) {
    throw new Error('Invalid state')
  }

  const updatedDoc: LocalConflicts = { ...localDoc }

  // If this was the last conflict lets remove the key for the component
  if (Object.keys(componentConflicts).length === 1) {
    delete updatedDoc[componentID]
  } else {
    delete componentConflicts[conflict.id]
    updatedDoc[componentID] = componentConflicts
  }

  const updated = await collection.upsertLocal(manuscriptID, updatedDoc)

  return updated.toJSON() as LocalConflicts
}

export const updateConflictLocally = async (
  collection: RxCollection<Model>,
  conflict: Conflict
) => {
  const { manuscriptID, _id: componentID } = conflict.local

  if (!manuscriptID) {
    // TODO: components that could conflict but don't have a manuscriptID
    throw new Error('No manuscriptID')
  }

  const localDoc = await getLocalConflictDoc(collection, manuscriptID)

  const componentConflicts = localDoc[componentID] || {}

  if (!(conflict.id in componentConflicts)) {
    throw new Error('Invalid state')
  }

  const updatedDoc: LocalConflicts = { ...localDoc }

  componentConflicts[conflict.id] = conflict
  updatedDoc[componentID] = componentConflicts

  const updated = await collection.upsertLocal(manuscriptID, updatedDoc)

  return updated.toJSON() as LocalConflicts
}

interface RevTreeNodeStatus {
  status: 'missing' | 'available'
}

// Ideally this would be, but limitations in the compiler...
// type RevTreeBranch = [string, RevTreeNodeStatus, RevTreeBranch[]]
// tslint:disable-next-line:no-any
type RevTreeBranch = [string, RevTreeNodeStatus, any[]]

interface RevTreeNode {
  pos: number
  ids: RevTreeBranch
}

export type RevTree = RevTreeNode[]

export const collectRevs = (branch: RevTreeBranch[], pos: number) => {
  const toVisit = branch.slice()
  const revs = []

  let node

  // tslint:disable-next-line:no-conditional-assignment
  while ((node = toVisit.pop())) {
    const [revId, , children] = node
    revs.push(`${++pos}-${revId}`)

    for (const child of children) {
      toVisit.push(child)
    }
  }

  return revs
}

export const prune = (revToRemove: string) => {
  return (revTree: RevTree) => {
    const toVisit = revTree.slice()

    let node
    // tslint:disable-next-line:no-conditional-assignment
    while ((node = toVisit.pop())) {
      const { pos, ids } = node
      const [, , branches] = ids

      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i]
        const [branchRevId] = branch

        // TODO: this check needs to be up one level in able to prune 1-pos.
        if (branchRevId === revToRemove) {
          const deletedBranch = branches.splice(i, 1)
          const revsToRemove = collectRevs(deletedBranch, pos)
          return revsToRemove
        } else {
          toVisit.push({ pos: pos + 1, ids: branch })
        }
      }
    }

    throw new Error('Unable to prune tree')
  }
}

export const updateDoc = (
  collection: RxCollection<Model>,
  changeDoc: PouchOpenRevsDoc
) => {
  const change = RxDB.fromPouchChange(changeDoc, collection)
  collection.$emit(change)
}

const removeRevs = async (
  collection: RxCollection<Model>,
  conflict: Conflict,
  revToRemove: string,
  winningRev: string
) => {
  const pouch: any = collection.pouch // tslint:disable-line:no-any

  return new Promise((resolve, reject) => {
    pouch._purgeRevs(
      conflict.local._id,
      prune(revToRemove),
      winningRev,
      // tslint:disable-next-line:no-any
      (err: any) => {
        if (err) {
          reject(err)
        } else {
          // TODO: load this again, just in case a change has happened
          updateDoc(collection, conflict.remote)
          resolve()
        }
      }
    )
  })
}

export const removeConflict = (
  collection: RxCollection<Model>,
  conflict: Conflict
) => {
  const revs = conflict.local._revisions.ids

  const ancestorIndex = revs.findIndex(rev =>
    conflict.ancestor._rev.endsWith(rev)
  )
  const revToRemove = revs[ancestorIndex - 1]
  const winningRev = conflict.remote._rev

  if (!winningRev) {
    throw new Error('Unable to find winning revision')
  }

  // TODO: would this go horribly wrong if pouch had deterministic hashes
  return removeRevs(collection, conflict, revToRemove, winningRev)
}

const getConflict = async (
  collection: RxCollection<Model>,
  conflictingRev: ConflictingRevision
): Promise<Conflict | null> => {
  const docs = await collection.pouch
    .get(conflictingRev.id, { revs: true, open_revs: 'all' })
    .then(async (docs: PouchOpenRevsResult[]) => {
      // TODO: the way we delete branches leaves a branch which look like
      // { missing: '7-afa5b13585694860948f440182b847af' }
      // we need to filter these out
      return docs.filter(x => x.ok).map(x => x.ok!)
    })

  if (docs.length === 1) {
    // the push has happened before the pull
    // we need this for pouch to build a local rev_tree which has two branches
    return null
  }

  // TODO: what if there are more than 2 branches
  // I don't think this is possible but still
  if (docs.length !== 2) {
    throw new Error('Invalid rev_tree')
  }

  // conflict.rev is the revision of the document that was rejected
  // i.e. failed to be pushed
  // therefore this is the local document
  const [doc1, doc2] = docs

  const [local, remote] =
    doc1._rev === conflictingRev.rev ? [doc1, doc2] : [doc2, doc1]

  // TODO: make this efficient
  const ancestorRev = remote._revisions.ids.find((rev: string) => {
    return local._revisions.ids.includes(rev)
  })

  if (!ancestorRev) {
    throw new Error('Unable to find common ancestor')
  }

  const index = remote._revisions.ids.indexOf(ancestorRev)

  const ancestor = await collection.pouch.get(remote._id, {
    rev: `${remote._revisions.start - index}-${ancestorRev}`,
    revs: true,
  })

  const id = `${local._rev}:${remote._rev}`

  return { id, ancestor, local, remote }
}

// For now we only really support MPParagraphElements
const supportedObjectTypes = new Set([PARAGRAPH])

export const supportedConflictType = (conflict: Conflict) => {
  if (!conflict.local.objectType) {
    return false
  }

  return supportedObjectTypes.has(conflict.local.objectType)
}

/**
 * Handle conflicts from `push` syncs of RxDB
 *
 * This function will save useful revisions of the conflicting documents
 * (i.e. the local HEAD, remote HEAD, and their nearest ancestor) to a
 * local-only collection
 *
 * Then it removes the branch/revisions from the ancestor to the local HEAD
 * from the main synced collection
 */
export const handleConflicts = async (
  collection: RxCollection<Model>,
  conflictingRevs: ConflictingRevision[]
) => {
  for (const conflictingRev of conflictingRevs) {
    const conflict = await getConflict(collection, conflictingRev)
    if (conflict) {
      if (supportedConflictType(conflict)) {
        await saveConflictLocally(collection, conflict)
      }
      await removeConflict(collection, conflict)
    }
  }
}

export const docPosition = (step: StepWithRange, pos: number): Step => {
  const { from, to } = step
  if (Number.isInteger(from) && Number.isInteger(to)) {
    step.from = from + pos
    step.to = to + pos
  } else {
    throw new Error('Unsupported step')
  }

  return step
}

export const applyLocalStep = (
  collection: RxCollection<Model>
): ApplyLocalStep => {
  return (conflict: Conflict, isFinalConflict: boolean) => {
    if (isFinalConflict) {
      return removeConflictLocally(collection, conflict)
    } else {
      // This is essentially a no-op
      return updateConflictLocally(collection, conflict)
    }
  }
}

const isParagraphElement = (model: Model): model is ParagraphElement =>
  model.objectType === PARAGRAPH

export const applyRemoteStep = (
  collection: RxCollection<Model>
): ApplyRemoteStep => {
  return (
    conflict: Conflict,
    hydratedNodes: HydratedNodes,
    step: Step,
    isFinalConflict: boolean
  ) => {
    const { local } = hydratedNodes

    const result = step.apply(local)

    if (result.failed) {
      throw new Error('Failed to apply reverse step to local conflict')
    }

    const newLocal: Model = modelFromNode(
      result.doc as ProsemirrorNode,
      // tslint:disable-next-line:no-any
      null as any,
      [],
      {
        value: 0,
      }
    )

    // tslint:disable-next-line:no-any
    const remainingConflict: any = { ...conflict }

    if (!isParagraphElement(remainingConflict.local)) {
      throw new Error('Not implemented')
    }

    // TODO: update _rev for consistency?
    remainingConflict.local.contents = (newLocal as Paragraph).contents

    if (isFinalConflict) {
      return removeConflictLocally(collection, conflict)
    } else {
      return updateConflictLocally(collection, conflict)
    }
  }
}
