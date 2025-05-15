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
import styled from 'styled-components'

export const Main = styled.main`
  height: 100%;
  flex: 1;
  position: relative;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.background.primary};
  background-image: linear-gradient(
    180deg,
    rgba(250, 250, 250, 1) 0%,
    rgba(250, 250, 250, 1) 38px,
    rgba(255, 255, 255, 1) 38px,
    rgba(255, 255, 255, 1) 100%
  );
`

export const Centered = styled(Main)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const PageContainer = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  box-sizing: border-box;
  width: 100%;
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.font.family.sans};
`

export const Page: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <PageContainer>{children}</PageContainer>
}
