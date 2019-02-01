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
