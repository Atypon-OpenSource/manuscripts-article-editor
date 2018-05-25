import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  TextFieldError,
  TextFieldErrorItem,
} from '../src/components/TextFieldError'

storiesOf('TextFieldError', module).add('default', () => (
  <TextFieldError>
    <TextFieldErrorItem>There was an error</TextFieldErrorItem>
  </TextFieldError>
))
