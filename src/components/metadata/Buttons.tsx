import { styled, ThemedProps } from '../../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const EditButton = styled.button`
  border-radius: 5px;
  border: solid 1px
    ${(props: ThemedDivProps) => props.theme.colors.button.primary};
  background: ${(props: ThemedDivProps) => props.theme.colors.button.primary};
  color: white;
  padding: 1px 7px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }

  &:hover {
    background: transparent;
    color: ${(props: ThemedDivProps) => props.theme.colors.button.primary};
  }
`
