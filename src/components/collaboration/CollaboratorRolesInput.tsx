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
import { styled } from '../../theme/styled-components'
import { RadioButton } from '../RadioButton'

type Props = React.InputHTMLAttributes<HTMLInputElement>

const Container = styled.div`
  color: ${props => props.theme.colors.popper.text.primary};
`

export const CollaboratorRolesInput: React.FunctionComponent<Props> = ({
  value,
  ...rest
}) => (
  <Container>
    <RadioButton
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
      name={name}
      checked={value === 'Writer'}
      value={'Writer'}
      textHint={'Can only review projects without modifying it'}
      {...rest}
    >
      Writer
    </RadioButton>

    <RadioButton
      name={name}
      checked={value === 'Viewer'}
      value={'Viewer'}
      textHint={'Can modify project contents'}
      {...rest}
    >
      Viewer
    </RadioButton>
  </Container>
)
