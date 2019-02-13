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

import React from 'react'
import { styled } from '../theme/styled-components'

const Arrow = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  border: 5px solid transparent;
  top: -5px;
  left: calc(16px);
  border-bottom-color: ${props =>
    props.theme.colors.alertMessage.error.background};
  border-top-width: 0;
  margin: 0 5px;
`

const Container = styled.div`
  background: ${props => props.theme.colors.alertMessage.error.background};
  color: ${props => props.theme.colors.alertMessage.error.text};
  border-radius: 2px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
  padding: 4px;
`

export const TextFieldErrorItem = styled.div`
  margin: 8px;
`

export const TextFieldError: React.FunctionComponent = ({ children }) => (
  <Container>
    <Arrow />
    {children}
  </Container>
)
