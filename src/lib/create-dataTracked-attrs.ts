/*!
 * © 2025 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  CHANGE_OPERATION,
  CHANGE_STATUS,
} from '@manuscripts/track-changes-plugin'
import { v4 as uuidv4 } from 'uuid'

export const createSetAttrsDataTracked = (
  authorID: string,
  oldAttrs: Record<string, unknown>
) => {
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

export const createDeleteAttrsDataTracked = (
  authorID: string,
  oldAttrs: Record<string, unknown>
) => {
  return {
    id: uuidv4(),
    authorID,
    operation: CHANGE_OPERATION.delete,
    status: CHANGE_STATUS.pending,
    statusUpdateAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    oldAttrs,
  }
}

export const createInsertAttrsDataTracked = (
  authorID: string,
  newAttrs: Record<string, unknown>
) => {
  return {
    id: uuidv4(),
    authorID,
    operation: CHANGE_OPERATION.insert,
    status: CHANGE_STATUS.pending,
    statusUpdateAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    newAttrs,
  }
} 