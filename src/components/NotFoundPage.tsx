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

import NotFound from '@manuscripts/assets/react/NotFound'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'

const FullSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  font-family: ${props => props.theme.font.family.sans};
`

const Message = styled.div`
  margin: 10px;
  flex-shrink: 0;
`

const Heading = styled.p`
  font-size: 150%;
  font-weight: ${props => props.theme.font.weight.bold};
`

const NotFoundPath = styled.span`
  font-weight: ${props => props.theme.font.weight.semibold};
`

const NotFoundPage = (props: RouteComponentProps) => (
  <FullSizeContainer>
    <NotFound />

    <Message>
      <Heading>This is probably not what you were looking for.</Heading>
      <p>
        Nothing found at <NotFoundPath>{props.location.pathname}</NotFoundPath>
      </p>
    </Message>
  </FullSizeContainer>
)

export default NotFoundPage
