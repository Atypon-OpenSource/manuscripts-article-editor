import { styled } from '../../theme/styled-components'

export const EditButton = styled.button`
  border-radius: 5px;
  border: solid 1px ${props => props.theme.colors.button.primary};
  background: ${props => props.theme.colors.button.primary};
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
    color: ${props => props.theme.colors.button.primary};
  }
`
