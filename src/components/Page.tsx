import styled from 'styled-components'

export const Page = styled('div')`
  display: flex;
  min-height: 100vh;
  box-sizing: border-box;
`

export const Sidebar = styled('div')`
  width: 200px;
  border-right: 1px solid #aaa;
`

export const Main = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`
