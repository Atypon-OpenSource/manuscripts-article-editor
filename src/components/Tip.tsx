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
import Tooltip, { Options } from 'tooltip.js'
import '../styles/tip.css'

type Props = Pick<Options, 'placement' | 'title'>

export class Tip extends React.Component<Props> {
  private tooltip: Tooltip
  private readonly containerRef: React.RefObject<HTMLDivElement>

  public constructor(props: Props) {
    super(props)
    this.containerRef = React.createRef()
  }

  public componentDidMount() {
    this.createTooltip()
  }

  public componentDidUpdate() {
    this.createTooltip()
  }

  public componentWillUnmount() {
    if (this.tooltip) {
      this.tooltip.dispose()
      delete this.tooltip
    }
  }

  public render() {
    const { children } = this.props

    return (
      <div
        ref={this.containerRef}
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        {children}
      </div>
    )
  }

  private createTooltip = () => {
    const { placement, title } = this.props

    this.tooltip = new Tooltip(this.containerRef.current!, {
      placement,
      title,
    })
  }

  private close = () => {
    this.tooltip.hide()
  }

  private open = () => {
    this.tooltip.show()
  }
}
