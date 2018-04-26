import * as React from 'react'
import styled, { ThemedStyledProps } from 'styled-components'
import { Theme } from '../theme'

const gridSize = 8
const resizerVisibleSize = 2

const toggleButtonDepth = gridSize * 4.5
const toggleArrowDepth = gridSize * 2
const toggleArrowSize = 2
const toggleArrowStartOffset = (toggleButtonDepth - toggleArrowDepth) / 2
const toggleArrowEndOffset =
  toggleArrowStartOffset - toggleArrowSize + toggleArrowDepth / 2
const opacityTransition = `opacity 200ms ease-in-out 100ms`
const transformTransition = `transform 100ms ease-in-out`

export interface ResizerButtonInnerProps {
  isCollapsed: boolean
  isVisible: boolean
  onClick?: () => void
}

type ThemedResizerButtonInnerProps = ThemedStyledProps<
  React.HTMLProps<HTMLButtonElement> & ResizerButtonInnerProps,
  Theme
>

const ResizerButtonInnerBase: React.SFC<ThemedResizerButtonInnerProps> = ({
  isCollapsed,
  isVisible,
  children,
  ...rest
}) => <button {...rest}>{children}</button>

const ResizerButtonInner = styled(ResizerButtonInnerBase)`
  position: relative;
  background: none;
  border: none;
  color: transparent;
  cursor: pointer;

  &:focus {
    outline: 1px solid blue;
  }

  &::before,
  &::after {
    content: '';
    background-color: #ddd;
    border-radius: ${toggleArrowDepth}px;
    position: absolute;
    opacity: ${(props: ThemedResizerButtonInnerProps) =>
      props.isVisible ? 1 : 0.5};
    transition: ${transformTransition}, ${opacityTransition};
  }

  &::before {
    transform-origin: ${toggleArrowSize / 2}px
      ${toggleArrowDepth / 2 - toggleArrowSize / 2}px;
  }

  &::after {
    transform-origin: ${toggleArrowSize / 2}px ${toggleArrowSize / 2}px;
  }

  &:hover,
  &:focus {
    &::before,
    &::after {
      background-color: ${(props: ThemedResizerButtonInnerProps) =>
        props.theme.resizerColor};
      opacity: 1;
    }
  }
`

const HorizontalResizerButtonInner = ResizerButtonInner.extend`
  top: calc(50% - ${toggleButtonDepth / 2}px);
  width: ${gridSize * 3}px;
  height: ${toggleButtonDepth}px;

  &::before,
  &::after {
    width: ${toggleArrowSize}px;
    height: ${toggleArrowDepth / 2}px;
    transform: rotate(0deg);
  }

  &::before {
    top: ${toggleArrowStartOffset}px;
  }

  &::after {
    top: ${toggleArrowEndOffset}px;
  }
`

export const HorizontalEndResizerButtonInner = HorizontalResizerButtonInner.extend`
  left: -${resizerVisibleSize / 2}px;

  &::before,
  &::after {
    left: 8px;
  }

  &:hover,
  &:focus {
    &::before {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '-40deg' : '40deg'}
      );
    }
    &::after {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '40deg' : '-40deg'}
      );
    }
  }
`

export const HorizontalStartResizerButtonInner = HorizontalResizerButtonInner.extend`
  right: -${resizerVisibleSize / 2}px;

  &::before,
  &::after {
    right: 16px;
  }

  &:hover,
  &:focus {
    &::before {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '40deg' : '-40deg'}
      );
    }
    &::after {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '-40deg' : '40deg'}
      );
    }
  }
`

const VerticalResizerButtonInner = ResizerButtonInner.extend`
  left: calc(50% - ${toggleButtonDepth / 2}px);
  width: ${toggleButtonDepth}px;
  height: ${gridSize * 3}px;

  &::before,
  &::after {
    width: ${toggleArrowDepth / 2}px;
    height: ${toggleArrowSize}px;
  }

  &::before {
    left: ${toggleArrowStartOffset}px;
  }

  &::after {
    left: ${toggleArrowEndOffset}px;
  }
`

export const VerticalEndResizerButtonInner = VerticalResizerButtonInner.extend`
  bottom: -${resizerVisibleSize / 2}px;

  &::before,
  &::after {
    bottom: 8px;
    transform-origin: top center;
  }

  &:hover,
  &:focus {
    &::before {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '40deg' : '-40deg'}
      );
    }
    &::after {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '-40deg' : '40deg'}
      );
    }
  }
`

export const VerticalStartResizerButtonInner = VerticalResizerButtonInner.extend`
  top: -${resizerVisibleSize / 2}px;

  &::before,
  &::after {
    top: 8px;
    transform: rotate(270deg);
    transform-origin: bottom center;
  }

  &:hover,
  &:focus {
    &::before {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '-40deg' : '40deg'}
      );
    }
    &::after {
      transform: rotate(
        ${(props: ThemedResizerButtonInnerProps) =>
          props.isCollapsed ? '40deg' : '-40deg'}
      );
    }
  }
`
