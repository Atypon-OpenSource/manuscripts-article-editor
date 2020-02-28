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

import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import ArrowUpBlue from '@manuscripts/assets/react/ArrowUpBlue'
import { SecondaryIconButton } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

const SliderContainer = styled.div<{
  hasLeft: boolean
  hasRight: boolean
}>`
  position: relative;

  ::before,
  ::after {
    background-color: ${props => props.theme.colors.border.secondary};
    content: ' ';
    display: none;
    height: 64px;
    width: 1px;
    position: absolute;
    z-index: 1;
    top: -11px;
  }
  ::before {
    left: -4px;
    ${props => props.hasLeft && 'display: block;'}
  }
  ::after {
    right: -4px;
    ${props => props.hasRight && 'display: block;'}
  }
`

const SliderContainerInner = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  -ms-overflow-style: none;
  margin: auto;
  width: 100%;

  // visibly hide scrollbars while retaining the functionality, Webkit & Firefox only
  ::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  scrollbar-width: none;
`
const SliderButton = styled(SecondaryIconButton).attrs(props => ({
  size: 20,
}))<{ left?: boolean; right?: boolean }>`
  border: none;
  border-radius: 50%;
  position: absolute;
  top: ${props => props.theme.grid.unit * 2}px;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${props => props.theme.colors.background.fifth};
    }
  }

  ${props => props.left && 'left: -36px;'};
  ${props => props.right && 'right: -36px;'};

  svg {
    transform: rotate(90deg);
    circle {
      stroke: ${props => props.theme.colors.border.secondary};
    }
  }
`

interface Props {
  scrollingDistance?: number
}

interface State {
  canScrollLeft: boolean
  canScrollRight: boolean
  hasOverflow: boolean
}

export class Slider extends React.Component<Props, State> {
  public state: Readonly<State> = {
    canScrollLeft: false,
    canScrollRight: false,
    hasOverflow: false,
  }

  private sliderRef = React.createRef<HTMLDivElement>()

  public componentDidMount(): void {
    this.checkForOverflow()
    this.checkForScrollPosition()

    if (this.sliderRef.current) {
      this.sliderRef.current.addEventListener(
        'scroll',
        this.checkForScrollPosition
      )
    }
  }

  public componentWillUnmount(): void {
    if (this.sliderRef.current) {
      this.sliderRef.current.removeEventListener(
        'scroll',
        this.checkForScrollPosition
      )
    }
  }

  public render() {
    const { scrollingDistance } = this.props
    const { canScrollLeft, canScrollRight } = this.state
    return (
      <SliderContainer hasLeft={canScrollLeft} hasRight={canScrollRight}>
        <SliderButton
          aria-label={'Scroll left'}
          left={true}
          type="button"
          disabled={!canScrollLeft}
          onClick={() => {
            this.scrollContainerBy(
              scrollingDistance ? -scrollingDistance : -200
            )
          }}
        >
          <ArrowDownBlue />
        </SliderButton>
        <SliderContainerInner ref={this.sliderRef}>
          {this.props.children}
        </SliderContainerInner>
        <SliderButton
          aria-label={'Scroll right'}
          right={true}
          type="button"
          disabled={!canScrollRight}
          onClick={() => {
            this.scrollContainerBy(scrollingDistance ? -scrollingDistance : 200)
          }}
        >
          <ArrowUpBlue />
        </SliderButton>
      </SliderContainer>
    )
  }

  private checkForOverflow = () => {
    if (this.sliderRef.current) {
      const { scrollWidth, clientWidth } = this.sliderRef.current
      const hasOverflow = scrollWidth > clientWidth

      this.setState({ hasOverflow })
    }
  }

  private checkForScrollPosition = () => {
    if (this.sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = this.sliderRef.current

      this.setState({
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft !== scrollWidth - clientWidth,
      })
    }
  }

  private scrollContainerBy = (distance: number) => {
    if (this.sliderRef.current) {
      this.sliderRef.current.scrollBy({ left: distance, behavior: 'smooth' })
    }
  }
}
