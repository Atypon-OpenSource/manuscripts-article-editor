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
import { styled } from '../../theme/styled-components'

const SadAnimal = React.lazy(() => import('./SadAnimal'))

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  width: 600px;
  max-width: 100%;
`

const TextContainer = styled.div`
  max-width: 400px;
  font-size: ${props => props.theme.font.size.medium};
  color: ${props => props.theme.colors.text.primary};
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  text-align: center;
`

interface Props {
  searchText: string
}

export const CitationStyleEmpty: React.FunctionComponent<Props> = ({
  searchText,
}) => (
  <Container>
    {searchText ? (
      <TextContainer>
        {`No matching template for query '${searchText}'.`}
      </TextContainer>
    ) : null}
    <React.Suspense fallback={'😿'}>
      <SadAnimal />
    </React.Suspense>
  </Container>
)
