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

declare module 'react-virtualized-auto-sizer' {
  interface Size {
    height: number
    width: number
  }

  class AutoSizer extends React.Component<{
    className?: string
    defaultHeight?: number
    defaultWidth?: number
    disableHeight?: boolean
    disableWidth?: boolean
    nonce?: string
    onResize?: (size: Size) => void
    style?: React.CSSProperties
    children: (size: Size) => React.ReactNode
  }> {}

  export default AutoSizer
}
