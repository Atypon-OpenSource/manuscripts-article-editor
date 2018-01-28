import styled from 'styled-components'

export const Page = styled('div')`
  display: flex;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
  font-family: ${props => props.theme.fontFamily};
`

export const Sidebar = styled('div')`
  width: 200px;
  padding: ${props => props.theme.padding};
  border-right: 1px solid #aaa;
`

export const Main = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`
