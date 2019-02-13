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

import { PlaceholderKit, SymbolDrawingFunction } from '@manuscripts/assets'
import React from 'react'

export enum IndicatorKind {
  Author,
  ContributorDetail,
  Contributors,
  Project,
  ReferenceLibrary,
}

// TODO: Actually provide small sizes in PaintCode project.
export enum IndicatorSize {
  // Small,
  Large,
}

export interface BaseIndicatorProps {
  readonly isDeterminate?: boolean
  readonly timeIncrement?: number
  readonly refreshRate?: number
  readonly symbolRotationMultiplier?: number
  readonly crossRotationMultiplier?: number
  readonly symbols?: IndicatorKind
}

export interface DeterminateIndicatorProps {
  readonly progress?: number
}

export interface SizedIndicatorProps {
  readonly size?: IndicatorSize
}

export type IndicatorProps = BaseIndicatorProps &
  DeterminateIndicatorProps &
  SizedIndicatorProps

export interface IndicatorState {
  time: number
}

export class InvalidIndicatorPropsError extends Error {
  constructor(message: string, readonly props: IndicatorProps) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class ProgressIndicator extends React.Component<
  IndicatorProps,
  IndicatorState
> {
  public static defaultProps = {
    progress: 0,
    size: IndicatorSize.Large,
    isDeterminate: false,
    timeIncrement: 0.001,
    symbolRotationMultiplier: 6.0,
    crossRotationMultiplier: 0.5,
    refreshRate: 25,
  }

  public state: Readonly<IndicatorState> = {
    time: 0,
  }

  private canvasRef: React.RefObject<HTMLCanvasElement>
  private tickHandle: number | null

  public constructor(props: IndicatorProps) {
    super(props)
    if (props.progress && props.progress > 0 && !props.isDeterminate) {
      throw new InvalidIndicatorPropsError(
        'progress > 0 for an indeterminate progress indicator',
        props
      )
    }
    this.canvasRef = React.createRef<HTMLCanvasElement>()
  }

  public componentDidMount() {
    this.updateCanvas()
    if (this.props.timeIncrement) {
      this.tickHandle = setInterval(this.tickFunction, this.props.refreshRate)
    }
  }

  public componentDidUpdate() {
    this.updateCanvas()
  }

  public updateCanvas() {
    if (!this.canvasRef.current) return

    PlaceholderKit.clearCanvas(this.canvasRef.current)
    PlaceholderKit.drawProgressIndication(
      this.canvasRef.current,
      this.state.time,
      this.props.progress || 0,
      this.props.isDeterminate || true
    )
    this.symbolDrawFunction()(
      this.canvasRef.current,
      this.state.time,
      this.props.symbolRotationMultiplier || 0,
      this.props.crossRotationMultiplier || 0
    )
  }

  public componentWillUnmount() {
    if (this.tickHandle) {
      clearInterval(this.tickHandle)
    }
  }

  public render() {
    // TODO: Actually handle the small size rendering in PaintCode.
    const dim = this.props.size === IndicatorSize.Large ? 375 : 100
    return <canvas ref={this.canvasRef} width={dim} height={dim} />
  }

  private tickFunction = () => {
    this.setState({
      time: this.state.time + (this.props.timeIncrement || 0),
    })
  }

  private symbolDrawFunction(): SymbolDrawingFunction {
    switch (this.props.symbols) {
      case IndicatorKind.Author:
        return PlaceholderKit.drawAuthorSymbols
      case IndicatorKind.ContributorDetail:
        return PlaceholderKit.drawContributorDetailSymbols
      case IndicatorKind.Contributors:
        return PlaceholderKit.drawContributorSymbols
      case IndicatorKind.Project:
        return PlaceholderKit.drawProjectSymbols
      case IndicatorKind.ReferenceLibrary:
        return PlaceholderKit.drawReferenceLibrarySymbols
      default:
        throw new InvalidIndicatorPropsError(
          'Invalid key "symbols" in props',
          this.props
        )
    }
  }
}

export class LargeDeterminateProjectsProgressIndicator extends ProgressIndicator {
  public static defaultProps = {
    progress: 0,
    size: IndicatorSize.Large,
    isDeterminate: false,
    timeIncrement: 0.001,
    symbolRotationMultiplier: 6.0,
    crossRotationMultiplier: 0.5,
    refreshRate: 25,
    symbols: IndicatorKind.Project,
  }
}
