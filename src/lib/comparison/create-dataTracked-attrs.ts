/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import {
  CHANGE_OPERATION,
  CHANGE_STATUS,
  TrackedAttrs,
} from '@manuscripts/track-changes-plugin'
import { v4 as uuidv4 } from 'uuid'

// Creates a dataTracked attribute for a set node attributes operation in comparison context
export const createComparisonSetAttrsDataTracked = (
  authorID: string,
  oldAttrs: Record<string, unknown>
): TrackedAttrs => {
  return {
    id: uuidv4(),
    authorID,
    reviewedByID: null,
    operation: CHANGE_OPERATION.set_node_attributes,
    status: CHANGE_STATUS.pending,
    statusUpdateAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    oldAttrs,
  }
}

// Creates a dataTracked attribute for a delete node operation in comparison context
export const createComparisonDeleteAttrsDataTracked = (
  authorID: string
): TrackedAttrs => {
  return {
    id: uuidv4(),
    authorID,
    reviewedByID: null,
    operation: CHANGE_OPERATION.delete,
    status: CHANGE_STATUS.pending,
    statusUpdateAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

// Creates a dataTracked attribute for an insert node operation in comparison context
export const createComparisonInsertAttrsDataTracked = (
  authorID: string
): TrackedAttrs => {
  return {
    id: uuidv4(),
    authorID,
    reviewedByID: null,
    operation: CHANGE_OPERATION.insert,
    status: CHANGE_STATUS.pending,
    statusUpdateAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
