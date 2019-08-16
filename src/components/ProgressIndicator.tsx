/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
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
