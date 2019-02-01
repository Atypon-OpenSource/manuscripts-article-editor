import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { styled } from '../theme/styled-components'

const Container = styled.div`
  z-index: 10;
`

export const PopperBodyContainer = styled.div`
  width: auto;
  min-width: 150px;
  white-space: nowrap;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px ${props => props.theme.colors.popper.border};
  border-radius: 5px;
  color: #444;
  padding: 4px 0;
  background: ${props => props.theme.colors.popper.background};
  z-index: 10;

  &[data-placement='bottom-start'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[data-placement='right-start'] {
    top: 10px;
  }
`

const ArrowUp = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid ${props => props.theme.colors.popper.border};
  top: 1px;
`

const ArrowDown = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid ${props => props.theme.colors.popper.border};
  bottom: 1px;
`

export const SeparatorLine = styled.div`
  margin: 10px 0 25px;
  background-color: ${props => props.theme.colors.popper.separator};
  height: 1px;
`

export const PopperBody = styled.div<{ size?: number }>`
  flex: 2;
  padding: 20px;
  max-width: ${props => props.size || 300}px;
`

interface Props {
  popperProps: PopperChildrenProps
}

export const CustomPopper: React.FunctionComponent<Props> = ({
  children,
  popperProps: { ref, style, placement, arrowProps },
}) => (
  <Container ref={ref} style={style} data-placement={placement}>
    <ArrowUp ref={arrowProps.ref} style={arrowProps.style} />
    <PopperBodyContainer>{children}</PopperBodyContainer>
  </Container>
)

export const CustomUpPopper: React.FunctionComponent<Props> = ({
  children,
  popperProps: { ref, style, placement, arrowProps },
}) => (
  <Container ref={ref} style={style} data-placement={placement}>
    <PopperBodyContainer>{children}</PopperBodyContainer>
    <ArrowDown ref={arrowProps.ref} style={arrowProps.style} />
  </Container>
)
