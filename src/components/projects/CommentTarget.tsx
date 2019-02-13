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

import React from 'react'

interface Props {
  isSelected: boolean
}

export class CommentTarget extends React.Component<Props> {
  private threadRef = React.createRef<HTMLDivElement>()

  public componentDidUpdate() {
    if (this.threadRef.current && this.props.isSelected) {
      // TODO: don't scroll into view if part of the thread is active?
      this.threadRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }
  }

  public render() {
    return <div ref={this.threadRef}>{this.props.children}</div>
  }
}
