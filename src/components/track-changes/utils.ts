/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { ManuscriptNode } from '@manuscripts/manuscript-transform'
import {
  CHANGE_OPERATION,
  CHANGE_STATUS,
  TrackedAttrs,
} from '@manuscripts/track-changes-plugin'

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
  return [...changes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : 0))[0]
}

export const trackedJoint = ':dataTracked:'

export const adaptTrackedData = (docJSONed: unknown) => {
  const cleanDoc = Object.assign({}, docJSONed)

  function deepCloneAttrs(object: any) {
    const copy = object === null ? null : Array.isArray(object) ? [] : {}
    for (const at in object) {
      const deeperClone =
        typeof object[at] !== 'object' ? object[at] : deepCloneAttrs(object[at])
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
    // It must be before conten check for the nodes like figures
    if (parent.content) {
      parent.content = parent.content.filter((child: ManuscriptNode) => {
        // the type is wrong. we get JSON and not the doc
        // pass through all the nodes with no track changes at all
        if (!child?.attrs?.dataTracked) {
          return true
        }
        // consider this for future implementation: text changes are in general not to be regarded => meaning always to pass through
        const lastChange = getLastChange(child.attrs.dataTracked)
        // this to be able to create a modelMap with models that are relevant but were spawn out of existing and have duplicate ids
        // this will fail with new prosemirror as attributes are read only but it's ok to modify them on an inactive document
        if (
          lastChange.status !== CHANGE_STATUS.rejected &&
          lastChange.operation !== CHANGE_OPERATION.delete
        ) {
          child.attrs = deepCloneAttrs(child.attrs) || {} // @TODO: needs refactoring, in case when there is a dataTracked attribute, we deep copy attributes 2 times.
          child.attrs.id = child.attrs.id + trackedJoint + lastChange.id
          return true
        }
        return false
      })
      parent.content.forEach((child: ManuscriptNode) => cleanNode(child))
    }
  }

  cleanNode(cleanDoc)

  return cleanDoc
}
