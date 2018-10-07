import { NavLink } from 'react-router-dom'
import { manuscriptsBlue } from '../colors'
import { styled } from '../theme'

export const ViewLink = styled(NavLink)`
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  background: none;
  color: white;

  &:hover,
  &.active {
    background: #fff;
    color: ${manuscriptsBlue};
  }
`
