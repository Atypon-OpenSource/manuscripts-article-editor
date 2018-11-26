import React from 'react'
import { ErrorProps } from './Form'
import { TextFieldLabel } from './TextField'
import { TextFieldError, TextFieldErrorItem } from './TextFieldError'

interface TextFieldContainerProps {
  label?: string
  error?: string | null | object
}

export const TextFieldContainer: React.FunctionComponent<
  TextFieldContainerProps
> = ({ label, error, children }) => {
  const childrenWithErrorProp = React.Children.map(
    children,
    (child: React.ReactElement<ErrorProps>) =>
      React.cloneElement(child, { error })
  )

  return (
    <React.Fragment>
      {label ? (
        <TextFieldLabel>
          {label} {childrenWithErrorProp}
        </TextFieldLabel>
      ) : (
        childrenWithErrorProp
      )}
      {error && (
        <TextFieldError>
          <TextFieldErrorItem>{error}</TextFieldErrorItem>
        </TextFieldError>
      )}
    </React.Fragment>
  )
}
