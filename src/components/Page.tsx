import React from 'react'
import { ThemedStyledProps } from 'styled-components'
import { injectGlobal, styled, Theme } from '../theme'
import MenuBar from './MenuBar'

injectGlobal`
  body {
    margin: 0;
  }
`

type ThemedDivProps = ThemedStyledProps<React.HTMLProps<HTMLDivElement>, Theme>

export const Main = styled.main`
  height: 100vh;
  flex: 1;
  position: relative;
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
  background-color: ${(props: ThemedDivProps) => props.theme.backgroundColor};
  color: ${(props: ThemedDivProps) => props.theme.color};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

const ViewsBar = styled.div`
  height: 100vh;
  width: 56px;
  display: flex;
  flex-direction: column;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.iconbarBackgroundColor};
`

const IconBar = styled.div`
  flex: 1;
  width: 56px;
  display: flex;
  flex-direction: column;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.iconbarBackgroundColor};
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
