import React from 'react'
import { TextFieldGroup } from './TextField'
import { TextFieldError, TextFieldErrorItem } from './TextFieldError'

interface Errors {
  [key: string]: string | object | undefined
}

const hasErrors = (errors: Errors) =>
  Object.values(errors).some(error => !!error)

interface TextFieldGroupContainerProps {
  errors?: Errors
}

export const TextFieldGroupContainer: React.FunctionComponent<
  TextFieldGroupContainerProps
> = ({ children, errors }) => {
  return (
    <TextFieldGroup>
      {children}

      {errors &&
        hasErrors(errors) && (
          <TextFieldError>
            {Object.entries(errors).map(
              ([key, error]) =>
                error && (
                  <TextFieldErrorItem id={`${key}-text-field-error`} key={key}>
                    {error}
                  </TextFieldErrorItem>
                )
            )}
          </TextFieldError>
        )}
    </TextFieldGroup>
  )
}
