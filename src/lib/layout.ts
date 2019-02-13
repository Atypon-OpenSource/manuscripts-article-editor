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

const storage = window.localStorage

export interface Pane {
  size: number
  collapsed: boolean
}

export interface Layout {
  [key: string]: Pane
}

const initialValues: { [key: string]: Partial<Pane> } = {
  inspector: {
    collapsed: true,
  },
  sidebar: {
    size: 250,
  },
}

const defaultPane: Pane = {
  size: 200,
  collapsed: false,
}

export const load = (): Layout => {
  const json = storage.getItem('layout')

  return json ? JSON.parse(json) : {}
}

export const save = (data: Layout): Layout => {
  storage.setItem('layout', JSON.stringify(data))

  return data
}

export default {
  get: (name: string): Pane => {
    const data = load()

    return data[name] || { ...defaultPane, ...initialValues[name] }
  },
  set: (name: string, pane: Pane): Pane => {
    const data = load()
    data[name] = pane
    save(data)

    return pane
  },
  remove: () => storage.removeItem('layout'),
}
