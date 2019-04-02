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

// Patching HTML5Backend.handleTopDropCapture to not call event.preventDefault
// https://github.com/react-dnd/react-dnd/issues/802

import createHTML5Backend from 'react-dnd-html5-backend'

// tslint:disable-next-line:no-any
export default (manager: any) => {
  const instance = createHTML5Backend(manager)

  // @ts-ignore (private)
  const original = instance.handleTopDropCapture

  // @ts-ignore (private)
  instance.handleTopDropCapture = (event: Event) => {
    event.preventDefault = () => {
      // do nothing
    }

    original(event)
  }

  return instance
}
