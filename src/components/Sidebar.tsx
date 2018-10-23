import { aliceBlue } from '../colors'
import { styled } from '../theme'

export const Sidebar = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 16px 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: ${aliceBlue};
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 12px;
  flex-shrink: 0;
`

export const SidebarTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #353535;
  flex: 1;
`

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 12px;
`

export const SidebarPersonContainer = styled.div`
  display: flex;
  margin: 0 -22px;
  padding: 10px 20px;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;

  & :hover {
    background-color: #e0eef9;
  }
`

export const SidebarSearchField = styled.div`
  display: flex;
  margin: 10px;
  align-items: center;
  cursor: pointer;
`

export const SidebarSearchText = styled.input`
  display: flex;
  flex: 1;
  font-size: 14px;
  border: none;
  background-color: transparent;
  height: 30px;
  position: relative;
  left: -16px;
  right: -16px;
  padding-left: 24px;

  &:hover,
  &:focus {
    background-color: #e0eef9;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`

export const SidebarSearchIconContainer = styled.span`
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`
