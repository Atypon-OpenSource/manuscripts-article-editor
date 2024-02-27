/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  CHANGE_OPERATION,
  CHANGE_STATUS,
  TrackedAttrs,
} from '@manuscripts/track-changes-plugin'
import { ManuscriptNode, schema } from '@manuscripts/transform'

const hasTrackingData = (node: ManuscriptNode) => {
  return !!node?.attrs?.dataTracked
}

export const filterNodesWithTrackingData = (node: any) => {
  const cleanDoc = Object.assign({}, node)

  const cleanNode = (parent: any) => {
    if (parent.content) {
      parent.content = parent.content.filter(
        (child: ManuscriptNode) => !hasTrackingData(child)
      )
      parent.content.forEach((child: ManuscriptNode) => cleanNode(child))
    }
  }

  cleanNode(cleanDoc)

  return cleanDoc
}

const getLastChange = (changes: TrackedAttrs[]) => {
  return [...changes].sort((a, b) => b.updatedAt - a.updatedAt)[0]
}

export const adaptTrackedData = (docJSONed: unknown) => {
  const cleanDoc = Object.assign({}, docJSONed)

  function deepCloneAttrs(object: any) {
    if (typeof object !== 'object' || object === null) {
      return object
    }
    const copy = Array.isArray(object) ? [] : {}
    for (const at in object) {
      const deeperClone = deepCloneAttrs(object[at])
      if (Array.isArray(object)) {
        // @ts-ignore
        copy.push(deeperClone)
      } else {
        // @ts-ignore
        copy[at] = deeperClone
      }
    }
    return copy
  }

  const cleanNode = (parent: any) => {
    parent.attrs = deepCloneAttrs(parent.attrs)
    // Prosemirror's Node.toJSON() references attributes so they have to be cloned to avoid disaster.
    // It must be done before content check for the nodes like figures
    if (parent.content) {
      parent.content = parent.content.filter((child: ManuscriptNode) => {
        // the type is wrong. we get JSON and not the doc
        // pass through all the nodes with no track changes at all
        if (!child?.attrs?.dataTracked) {
          return true
        }
        // consider this for future implementation: text changes are in general not to be regarded => meaning always to pass through
        const lastChange = getLastChange(child.attrs.dataTracked)

        // for the cases when we change attributes we need to pick oldAttributes if the last change is reject.
        // The oldAttributes are the last attributes before the rejected change
        // so they represent current real values
        if (
          lastChange.status == CHANGE_STATUS.rejected &&
          lastChange.operation == CHANGE_OPERATION.set_node_attributes
        ) {
          // please notate that since we work on a copy of a document that is not active it is fine to assign readonly attributes
          // @ts-ignore
          child.attrs = deepCloneAttrs(lastChange.oldAttrs)
          return true
        }

        // removing all the deleted nodes
        if (
          lastChange.operation == CHANGE_OPERATION.delete &&
          lastChange.status !== CHANGE_STATUS.rejected
        ) {
          return false
        }

        // removing supplement nodes in case insert rejected,
        // not sure if we will need to do it for other nodes
        if (
          child.type === schema.nodes.supplement &&
          lastChange.operation == CHANGE_OPERATION.insert &&
          lastChange.status === CHANGE_STATUS.rejected
        ) {
          return false
        }

        // @ts-ignore
        child.attrs = deepCloneAttrs(child.attrs) || {} // @TODO: needs refactoring, in case when there is a dataTracked attribute, we deep copy attributes 2 times.
        return true
      })
      parent.content.forEach((child: ManuscriptNode) => cleanNode(child))
    }
  }

  cleanNode(cleanDoc)

  return cleanDoc
}
