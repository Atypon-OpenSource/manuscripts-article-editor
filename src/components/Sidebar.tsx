import { styled } from '../theme'

export const Sidebar = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 16px 75px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 0px;
`

export const SidebarTitle = styled.div`
  font-family: Barlow;
  font-size: 24px;
  font-weight: 600;
  color: #353535;
  flex: 1;
`

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 0px;
`
