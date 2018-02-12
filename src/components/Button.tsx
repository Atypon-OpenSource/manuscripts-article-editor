import * as React from 'react'
import { Link } from 'react-router-dom'
import { ThemedStyledProps } from 'styled-components'
import { styled, ThemeInterface } from '../theme'

export type ButtonProps = ThemedStyledProps<
  React.HTMLProps<HTMLButtonElement>,
  ThemeInterface
>

interface IconButtonProps extends ButtonProps {
  size?: number
}

export const Button = styled.button`
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

export const ActionButton = PrimaryButton.extend`
  border-radius: 50%;
  width: 2em;
  height: 2em;
`

export const HelpButton = Button.extend`
  border-radius: 50%;
  width: 2em;
  height: 2em;
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
