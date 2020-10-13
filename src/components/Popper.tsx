/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import styled from 'styled-components'

const Container = styled.div`
  z-index: 10;
`

export const PopperBodyContainer = styled.div`
  width: auto;
  min-width: 150px;
  white-space: nowrap;
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  border: solid 1px ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  color: ${(props) => props.theme.colors.text.secondary};
  background: ${(props) => props.theme.colors.background.primary};
  z-index: 10;

  &[data-placement='bottom-start'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[data-placement='right-start'] {
    top: 10px;
  }
`

const ArrowUp = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  border-right: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  border-bottom: ${(props) => props.theme.grid.unit * 2}px solid
    ${(props) => props.theme.colors.background.primary};
  top: 1px;
`

const ArrowDown = styled.div`
  position: relative;
  width: 0;
  height: 0;
  border-left: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  border-right: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  border-top: ${(props) => props.theme.grid.unit * 2}px solid
    ${(props) => props.theme.colors.background.primary};
  bottom: 1px;
`

export const SeparatorLine = styled.div`
  margin: ${(props) => props.theme.grid.unit * 2}px 0
    ${(props) => props.theme.grid.unit * 6}px;
  background-color: ${(props) => props.theme.colors.border.secondary};
  height: 1px;
`

export const PopperBody = styled.div<{ size?: number }>`
  box-sizing: border-box;
  flex: 2;
  padding: ${(props) => props.theme.grid.unit * 5}px;
  max-width: ${(props) => props.size || 300}px;
`

interface Props {
  popperProps: PopperChildrenProps
}

export const CustomPopper: React.FunctionComponent<Props> = ({
  children,
  popperProps: { ref, style, placement, arrowProps },
}) => (
  <Container ref={ref} style={style} data-placement={placement}>
    <ArrowUp ref={arrowProps.ref} style={arrowProps.style} />
    <PopperBodyContainer>{children}</PopperBodyContainer>
  </Container>
)

export const CustomUpPopper: React.FunctionComponent<Props> = ({
  children,
  popperProps: { ref, style, placement, arrowProps },
}) => (
  <Container ref={ref} style={style} data-placement={placement}>
    <PopperBodyContainer>{children}</PopperBodyContainer>
    <ArrowDown ref={arrowProps.ref} style={arrowProps.style} />
  </Container>
)
