import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { styled } from '../theme'

const Container = styled.div`
  z-index: 10;
`

export const PopperBodyContainer = styled.div`
  width: auto;
  min-width: 150px;
  white-space: nowrap;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #d6d6d6;
  border-radius: 5px;
  color: #444;
  padding: 4px 0;
  background: white;
  z-index: 10;

  &[data-placement='bottom-start'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[data-placement='right-start'] {
    top: 10px;
  }
`

const Arrow = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #d6d6d6;
  top: 1px;
`

export const SeparatorLine = styled.div`
  margin: 10px 0;
  background-color: #e6e6e6;
  height: 1px;
`

export const PopperBody = styled.div<{ size?: number }>`
  flex: 2;
  padding: 20px;
  max-width: ${props => props.size || 280}px;
`

interface Props {
  popperProps: PopperChildrenProps
}

export const CustomPopper: React.SFC<Props> = ({
  children,
  popperProps: { ref, style, placement, arrowProps },
}) => (
  <Container
    // @ts-ignore: styled
    ref={ref}
    style={style}
    data-placement={placement}
  >
    <Arrow
      // @ts-ignore: styled
      ref={arrowProps.ref}
      style={arrowProps.style}
    />
    <PopperBodyContainer>{children}</PopperBodyContainer>
  </Container>
)
