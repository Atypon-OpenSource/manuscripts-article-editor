import { jellyBeanBlue, manuscriptsBlue } from '../../colors'
import { styled } from '../../theme'

export const EditButton = styled.button`
  border-radius: 5px;
  border: none;
  background: ${manuscriptsBlue};
  color: white;
  padding: 2px 8px;
  margin-left: 8px;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }

  &:hover {
    background: ${jellyBeanBlue};
  }
`
