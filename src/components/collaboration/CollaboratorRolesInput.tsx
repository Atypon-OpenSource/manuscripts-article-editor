import React from 'react'
import { styled, ThemedProps } from '../../theme'
import { RadioButton } from '../RadioButton'

type Props = React.InputHTMLAttributes<HTMLInputElement>
type ThemedDivProps = ThemedProps<HTMLDivElement>

const Container = styled.div`
  color: ${(props: ThemedDivProps) => props.theme.colors.popper.text.primary};
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
