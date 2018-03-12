import * as React from 'react'
import { ThemedStyledProps } from 'styled-components'
import { injectGlobal, styled, Theme } from '../theme'

injectGlobal`
  body {
    margin: 0;
  }
`

export type PageProps = ThemedStyledProps<
  React.HTMLProps<HTMLDivElement>,
  Theme
>

export const Page = styled.div`
  display: flex;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: ${(props: PageProps) => props.theme.backgroundColor};
  color: ${(props: PageProps) => props.theme.color};
  font-family: ${(props: PageProps) => props.theme.fontFamily};
`

export const Sidebar = styled.div`
  width: 272px;
  padding: 20px;
  background-color: ${(props: PageProps) => props.theme.sidebarBackgroundColor};
`

export const Main = styled.main`
  flex: 1;
  position: relative;
`

export const Centered = Main.extend`
  display: flex;
  flex-direction: column;
  align-items: center;
`
