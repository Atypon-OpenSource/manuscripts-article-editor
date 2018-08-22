import React from 'react'
import { RadioButton } from './RadioButton'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const CollaboratorRolesInput: React.SFC<Props> = ({
  value,
  ...rest
}) => (
  <React.Fragment>
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
  </React.Fragment>
)
