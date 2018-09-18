import { ButtonHTMLAttributes } from 'react'
import { dustyGrey, manuscriptsBlue } from '../colors'
import { styled, ThemedOuterProps, ThemedProps } from '../theme'

export type ThemedButtonProps = ThemedProps<HTMLButtonElement>
type ThemedOuterButtonProps = ThemedOuterProps<HTMLButtonElement>

interface IconButtonProps extends ThemedButtonProps {
  size?: number
}

export const Button = styled.button.attrs({
  type: 'button',
})<{ type?: string }>`
  background-color: #fff;
  color: ${(props: ThemedButtonProps) => props.theme.colors.button.primary};
  border: 2px solid transparent;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 10px 3px;
  font-family: ${(props: ThemedButtonProps) => props.theme.fontFamily};
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props: ThemedButtonProps) =>
    props.disabled ? 'text' : 'pointer'};
  opacity: ${(props: ThemedButtonProps) => (props.disabled ? '0.5' : '1.0')};
  transition: border 0.1s, color 0.1s, background-color 0.1s;
  white-space: nowrap;

  &:hover {
    background-color: #fff;
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.primary};
    border-color: #4489d8;
  }

  &:active {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    color: white;
  }
`

export const PrimaryButton = styled(Button)<
  ButtonHTMLAttributes<HTMLButtonElement>
>`
  background-color: ${(props: ThemedButtonProps) =>
    props.theme.colors.button.primary};
  color: #fff;

  &:hover {
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
  }

  &:active {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    color: white;
  }
`

export const DeleteButton = styled(Button)`
  border-color: ${(props: ThemedButtonProps) =>
    props.theme.colors.button.danger};
  color: ${(props: ThemedButtonProps) => props.theme.colors.button.danger};

  &:hover {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    color: #fff;
  }

  &:active {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    color: #fff;
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

export const TransparentBlackButton = styled(Button)`
  color: #585858;
  background-color: transparent;

  &:hover {
    background-color: transparent;
    border-color: ${manuscriptsBlue};
    color: ${manuscriptsBlue};
  }

  &:active {
    border-color: transparent;
    background-color: transparent;
    color: ${dustyGrey};
  }
`

export const TransparentGreyButton = styled(Button)`
  color: ${dustyGrey};
  background-color: transparent;

  &:hover {
    background-color: transparent;
    border-color: ${manuscriptsBlue};
    color: ${manuscriptsBlue};
  }

  &:active {
    border-color: transparent;
    background-color: transparent;
    color: ${dustyGrey};
  }
`

export const ManuscriptBlueButton = styled(PrimaryButton)`
  background-color: ${manuscriptsBlue};

  & :hover {
    background-color: transparent;
    border-color: ${manuscriptsBlue};
    color: ${manuscriptsBlue};
  }

  & :active {
    border-color: transparent;
    background-color: transparent;
    color: ${manuscriptsBlue};
  }
`

export const IconButton = styled.button<ThemedOuterButtonProps>`
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

export const MiniButton = styled(Button)`
  padding: 0 7px;
  margin: 0 5px;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
`

export const PrimaryMiniButton = styled(MiniButton)`
  color: white;
  background-color: ${(props: ThemedButtonProps) =>
    props.theme.colors.button.primary};
`
