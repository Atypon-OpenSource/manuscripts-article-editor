import React from 'react'
import { StringMap } from '../editor/config/types'
import { TextFieldGroup } from './TextField'
import { TextFieldError, TextFieldErrorItem } from './TextFieldError'

const hasErrors = (errors: StringMap<{} | string | null>) =>
  Object.values(errors).some(error => !!error)

interface TextFieldGroupContainerProps {
  errors?: StringMap<string | {} | null>
}

export const TextFieldGroupContainer: React.SFC<
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
