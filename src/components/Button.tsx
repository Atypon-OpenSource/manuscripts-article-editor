import * as React from 'react'
import { Link } from 'react-router-dom'
import { ThemedStyledProps } from 'styled-components'
import { styled, Theme } from '../theme'

export type ButtonProps = ThemedStyledProps<
  React.HTMLProps<HTMLButtonElement>,
  Theme
>

interface IconButtonProps extends ButtonProps {
  size?: number
}

export const Button = styled.button.attrs({
  type: 'button',
})`
  background-color: #fff;
  color: ${(props: ButtonProps) => props.theme.primary};
  border: 2px solid transparent;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 10px 3px;
  font-family: ${(props: ButtonProps) => props.theme.fontFamily};
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props: ButtonProps) => (props.disabled ? 'text' : 'pointer')};
  opacity: ${(props: ButtonProps) => (props.disabled ? '0.5' : '1.0')};
  transition: border 0.1s, color 0.1s, background-color 0.1s;

  &:hover {
    background-color: #fff;
    color: ${(props: ButtonProps) => props.theme.primary};
    border-color: #4489d8;
  }

  &:active {
    background-color: ${(props: ButtonProps) => props.theme.active};
    border-color: ${(props: ButtonProps) => props.theme.active};
    color: white;
  }
`

export const PrimaryButton = Button.extend`
  background-color: ${(props: ButtonProps) => props.theme.primary};
  color: #fff;

  &:hover {
    border-color: #4489d8;
  }

  &:active {
    background-color: #274c76;
    border-color: #274c76;
    color: white;
  }
`

export const ActionButton = styled.div`
  background-color: #ffce7e;
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  height: 60px;
  width: 20px;
  margin: -40px 10px 0;
  padding: 10px;
  border-radius: 0 0 8px 8px;
  transition: 0.1s background-color;

  &:hover {
    background-color: #ffae5e;
  }

  &:active {
    background-color: #ffae5e;
  }

  &:focus {
    outline: none;
  }
`

export const HelpButton = ActionButton.extend`
  background-color: #90cddc;
  color: white;

  &:hover {
    background-color: #70addc;
  }

  &:active {
    background-color: white;
  }
`

export const LinkButton = styled(Link)`
  display: inline-block;
  color: ${(props: ButtonProps) => props.theme.primary};
  padding: 5px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const IconButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  width: ${(props: IconButtonProps) => props.size || 64}px;
  height: ${(props: IconButtonProps) => props.size || 64}px;

  & img {
    width: 100%;
    height: 100%;
  }
`

export const MiniButton = Button.extend`
  padding: 0 7px;
  margin: 0 5px;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
`

export const PrimaryMiniButton = MiniButton.extend`
  color: white;
  background-color: ${(props: ButtonProps) => props.theme.primary};
`
