import * as React from 'react'
import { ThemedStyledProps } from 'styled-components'
import { injectGlobal, styled, Theme } from '../theme'

injectGlobal`
  body {
    margin: 0;
  }
`

export type ThemedDivProps = ThemedStyledProps<
  React.HTMLProps<HTMLDivElement>,
  Theme
>

export const Page = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  background-color: ${(props: ThemedDivProps) => props.theme.backgroundColor};
  color: ${(props: ThemedDivProps) => props.theme.color};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
`

export const IconBar = styled.div`
  height: 100vh;
  width: 40px;
  display: flex;
  flex-direction: column;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.iconbarBackgroundColor};
`

export const Sidebar = styled.div`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 100%;
  height: 100%;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.sidebarBackgroundColor};
  box-sizing: border-box;
`

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
