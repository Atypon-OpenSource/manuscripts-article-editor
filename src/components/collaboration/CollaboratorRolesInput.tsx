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

import { RadioButton } from '../RadioButton'

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Container = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
`

export const CollaboratorRolesInput: React.FunctionComponent<Props> = ({
  value,
  name,
  ...rest
}) => (
  <Container>
    <RadioButton
      _id={'owner'}
      checked={value === 'Owner'}
      value={'Owner'}
      textHint={
        'Can modify and delete project, invite and remove collaborators'
      }
      {...rest}
    >
      Owner
    </RadioButton>

    <RadioButton
      _id={'writer'}
      name={name}
      checked={value === 'Writer'}
      value={'Writer'}
      textHint={'Can modify project contents'}
      {...rest}
    >
      Writer
    </RadioButton>

    <RadioButton
      _id={'viewer'}
      name={name}
      checked={value === 'Viewer'}
      value={'Viewer'}
      textHint={'Can only review projects without modifying it'}
      {...rest}
    >
      Viewer
    </RadioButton>
  </Container>
)
