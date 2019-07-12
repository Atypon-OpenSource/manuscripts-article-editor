/*!
 * © 2019 Atypon Systems LLC
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
  toolbar as manuscriptToolbar,
  ToolbarButtonConfig,
} from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import {
  TitleEditorState,
  TitleEditorView,
  TitleSchema,
  toolbar as titleToolbar,
} from '@manuscripts/title-editor'

export type MessageHandler = 'toolbar'

export const postWebkitMessage = (handler: MessageHandler, message: object) => {
  if (window.webkit && window.webkit.messageHandlers) {
    window.webkit.messageHandlers[handler].postMessage(message)
  }
}

interface ToolbarState {
  [key: string]: {
    active?: boolean
    enabled?: boolean
  }
}

// manuscript toolbar

const manuscriptToolbarItems = new Map<
  string,
  ToolbarButtonConfig<ManuscriptSchema>
>()

for (const section of Object.values(manuscriptToolbar)) {
  for (const [key, item] of Object.entries(section)) {
    manuscriptToolbarItems.set(key, item)
  }
}

export const manuscriptToolbarState = (state: ManuscriptEditorState) => {
  const output: ToolbarState = {}

  for (const [key, item] of manuscriptToolbarItems.entries()) {
    output[key] = {
      active: item.active ? item.active(state) : undefined,
      enabled: item.enable ? item.enable(state) : undefined,
    }
  }

  return output
}

export const createDispatchManuscriptToolbarAction = (
  view: ManuscriptEditorView
) => (key: keyof typeof manuscriptToolbarItems) => {
  const item = manuscriptToolbarItems.get(key)

  if (!item) {
    throw new Error(`Unknown manuscript toolbar item ${item}`)
  }

  item.run(view.state, view.dispatch)
}

// title toolbar

const titleToolbarItems = new Map<string, ToolbarButtonConfig<TitleSchema>>()

for (const section of Object.values(titleToolbar)) {
  for (const [key, item] of Object.entries(section)) {
    titleToolbarItems.set(key, item)
  }
}

export const titleToolbarState = (state: TitleEditorState) => {
  const output: ToolbarState = {}

  for (const [key, item] of titleToolbarItems.entries()) {
    output[key] = {
      active: item.active ? item.active(state) : undefined,
      enabled: item.enable ? item.enable(state) : undefined,
    }
  }

  return output
}

export const createDispatchTitleToolbarAction = (view: TitleEditorView) => (
  key: keyof typeof titleToolbarItems
) => {
  const item = titleToolbarItems.get(key)

  if (!item) {
    throw new Error(`Unknown title toolbar item ${item}`)
  }

  item.run(view.state, view.dispatch)
}
