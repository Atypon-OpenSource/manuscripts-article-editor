import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import {
  altoGrey,
  dustyGrey,
  manuscriptsBlue,
  manuscriptsGrey,
} from '../colors'
import { styled, ThemedProps } from '../theme'
import { Button, PrimaryButton } from './Button'
import { TextField } from './TextField'

type ThemedDivProps = ThemedProps<HTMLDivElement>

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

export const ShareProjectHeader = styled.div`
  padding: 10px 20px 10px;
  & ${Button} {
    color: ${dustyGrey};
    background-color: white;
  }

  & ${PrimaryButton} {
    background-color: ${manuscriptsBlue};
  }

  & ${Button}:hover, ${PrimaryButton}:hover {
    background-color: white;
    border-color: ${manuscriptsBlue};
    color: ${manuscriptsBlue};
  }

  & ${Button}:active, ${PrimaryButton}:active {
    border-color: white;
  }
`

export const ShareProjectTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.9px;
  color: ${manuscriptsGrey};
  display: inline-block;
  padding-right: 20px;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

export const Main = styled.div`
  flex: 1;
  padding: 20px 20px;
`

export const URIFieldContainer = styled.div`
  display: flex;
  & ${TextField} {
    border-color: ${altoGrey};
    border-right: transparent;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  & ${Button} {
    color: ${manuscriptsBlue};
    border-color: ${altoGrey};
    border-width: thin;
    border-left: transparent;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  & ${Button}:active {
    color: ${dustyGrey};
    background-color: white;
    border-color: white;
  }
`

export const TextHint = styled.span`
  font-size: 14px;
  letter-spacing: -0.3px;
  text-align: left;
  color: ${dustyGrey};
  clear: both;
  display: block;
  margin-top: 15px;
  padding-bottom: 10px;
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

export const RadioButton = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  border: solid 1px ${dustyGrey};

  &:after {
    position: absolute;
    display: none;
    content: '';
  }
`

export const Control = styled.label`
  font-size: 18px;
  font-weight: 300;
  position: relative;
  display: block;
  line-height: 1.06;
  letter-spacing: normal;
  color: ${manuscriptsGrey};
  padding-left: 30px;
  cursor: pointer;

  & input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  &:hover input ~ ${RadioButton} {
    background: ${dustyGrey};
  }

  &:hover input:checked ~ ${RadioButton} {
    background: ${manuscriptsBlue};
  }

  & input:checked ~ ${RadioButton}:after {
    display: block;
  }

  & ${RadioButton}:after {
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${manuscriptsBlue};
  }

  & ${TextHint} {
    margin-top: 4px;
  }
`

export interface Props {
  popperProps: PopperChildrenProps
}

export const ShareProjectPopper: React.SFC<Props> = ({
  children,
  popperProps,
}) => (
  <Container
    innerRef={popperProps.ref}
    style={popperProps.style}
    data-placement={popperProps.placement}
  >
    <Arrow
      innerRef={popperProps.arrowProps.ref}
      style={popperProps.arrowProps.style}
    />
    {children}
  </Container>
)
