import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface ButtonProps {
  disabled?: boolean
}

export const Button = styled('button')`
  background: white;
  color: #777;
  text-transform: uppercase;
  padding: 7px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 7px;
  cursor: ${(props: ButtonProps) => (props.disabled ? 'text' : 'pointer')};
  opacity: ${(props: ButtonProps) => (props.disabled ? '0.5' : '1.0')};
  display: inline-flex;
  align-items: center;
`

export const PrimaryButton = Button.extend`
  background-color: #fff;
  color: #555;

  &:hover {
    background-color: ${(props: ButtonProps) =>
      props.disabled ? '#fff' : '#ddd'};
  }
`

interface IconButtonProps extends ButtonProps {
  size?: number
}

export const IconButton = styled('button')`
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

export const PlainButton = Button.extend`
  background: none;
  color: inherit;
`

export const LinkButton = styled(Link)`
  display: inline-block;
  color: white;
  padding: 5px;

  &:hover {
    color: #ddd;
  }
`
