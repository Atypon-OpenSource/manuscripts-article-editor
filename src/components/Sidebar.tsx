import React from 'react'
import { ThemedStyledProps } from 'styled-components'
import { styled, Theme } from '../theme'

type ThemedDivProps = ThemedStyledProps<React.HTMLProps<HTMLDivElement>, Theme>

export const Sidebar = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 16px 8px;
  background-color: ${(props: ThemedDivProps) =>
    props.theme.sidebarBackgroundColor};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 12px;
`

export const SidebarTitle = styled.div`
  font-size: 150%;
  color: gray;
  flex: 1;
`

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 12px;
`
