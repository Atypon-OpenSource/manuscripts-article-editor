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

import registerRequireContextHook from 'babel-plugin-require-context-hook/register'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'
import uuid from 'uuid/v4'

registerRequireContextHook()

configure({ adapter: new Adapter() })

process.env.API_BASE_URL = 'https://127.0.0.1/'

const supportedCommands: string[] = []

Object.defineProperty(document, 'queryCommandSupported', {
  value: (cmd: string) => supportedCommands.includes(cmd),
})

Object.defineProperty(document, 'execCommand', {
  value: (cmd: string) => supportedCommands.includes(cmd),
})

// https://github.com/jsdom/jsdom/issues/317

Object.defineProperty(document, 'createRange', {
  value: () => ({
    createContextualFragment: JSDOM.fragment,
  }),
})

if (!window.URL.createObjectURL) {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(() => 'blob:https://localhost/' + uuid()),
  })
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(media => ({
      matches: false,
      media,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  })
}
