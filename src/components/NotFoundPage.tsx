/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
  font-family: ${props => props.theme.fontFamily};
`

const Message = styled.div`
  margin: 10px;
  flex-shrink: 0;
`

const Heading = styled.p`
  font-size: 150%;
  font-weight: bold;
`

const NotFoundPath = styled.span`
  font-weight: 600;
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
