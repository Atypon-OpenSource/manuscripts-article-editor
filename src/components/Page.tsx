import React from 'react'
import { injectGlobal, styled, ThemedProps } from '../theme'
import MenuBar from './MenuBar'

injectGlobal`
  body {
    margin: 0;
  }
`

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const Main = styled.main`
  height: 100vh;
  flex: 1;
  position: relative;
  box-sizing: border-box;
`

export const Centered = Main.extend`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  color: ${(props: ThemedDivProps) => props.theme.colors.primary.black};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

const ViewsBar = styled.div`
  height: 100vh;
  width: 56px;
  display: flex;
  flex-direction: column;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.primary.blue};
`

const IconBar = styled.div`
  flex: 1;
  width: 56px;
  display: flex;
  flex-direction: column;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.primary.blue};
`

export const Page: React.SFC = ({ children }) => (
  <PageContainer>
    <ViewsBar>
      <MenuBar />
      <IconBar />
    </ViewsBar>

    {children}
  </PageContainer>
)
