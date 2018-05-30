import { NavLink } from 'react-router-dom'
import { styled } from '../theme'

export const DropdownContainer = styled.div`
  position: relative;
`

export const DropdownToggle = styled.button`
  border: none;
  background: none;
  color: #999;
  font-size: inherit;
  cursor: pointer;

  &:hover {
    color: #7fb5d5;
  }

  &:focus {
    outline: none;
  }
`

export const Dropdown = styled.div`
  position: absolute;
  top: 32px;
  left: 5px;
  padding: 5px 0;
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
`

export const DropdownLink = styled(NavLink)`
  padding: 10px 20px;
  display: block;
  text-decoration: none;
  color: inherit;
  white-space: nowrap;

  &:hover {
    background: #7fb5d5;
    color: white;
  }
`
