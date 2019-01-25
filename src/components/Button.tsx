import { styled, ThemedProps } from '../theme'

export type ThemedButtonProps = ThemedProps<HTMLButtonElement>

interface IconButtonProps extends ThemedButtonProps {
  size?: number
}

export const Button = styled.button.attrs({
  type: 'button',
})`
  background-color: transparent;
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

  &:hover:disabled {
    background-color: transparent;
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.primary};
    border-color: transparent;
  }

  &:hover {
    background-color: transparent;
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.primary};
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

export const PrimaryButton = styled(Button)`
  background-color: ${(props: ThemedButtonProps) =>
    props.theme.colors.button.primary};
  color: white;

  &:hover {
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
  }

  &:hover:disabled {
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    color: white;
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    cursor: unset;
  }
`

export const PrimarySubmitButton = styled(PrimaryButton).attrs({
  type: 'submit',
})``

export const DangerButton = styled(Button)`
  border-color: ${(props: ThemedButtonProps) =>
    props.theme.colors.button.danger};
  color: ${(props: ThemedButtonProps) => props.theme.colors.button.danger};

  &:hover {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    color: white;
  }

  &:active {
    background-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    color: transparent;
  }

  &:hover:disabled {
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.danger};
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.danger};
  }
`

export const DangerSubmitButton = styled(DangerButton).attrs({
  type: 'submit',
})``

export const GreyButton = styled(Button)`
  color: ${(props: ThemedButtonProps) => props.theme.colors.button.secondary};
  background-color: transparent;

  &:hover {
    background-color: transparent;
    border-color: ${(props: ThemedButtonProps) =>
      props.theme.colors.button.primary};
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.primary};
  }

  &:active {
    border-color: transparent;
    background-color: transparent;
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.secondary};
  }

  &:hover:disabled {
    color: ${(props: ThemedButtonProps) => props.theme.colors.button.secondary};
    background-color: transparent;
  }
`

export const IconButton = styled.button<ThemedButtonProps>`
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

export const PrimaryMiniButton = styled(PrimaryButton)`
  padding: 0 7px;
  margin: 0 5px;
  height: 20px;
  font-size: 12px;
  border-radius: 5px;
`
