import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { TextField, TextFieldGroup } from '../src/components/TextField'

storiesOf('TextField', module)
  .add('default', () => <TextField />)
  .add('required', () => <TextField required={true} />)
  .add('with placeholder', () => <TextField placeholder={'Enter some text'} />)
  .add('type: email', () => <TextField type={'email'} required={true} />)
  .add('type: password', () => <TextField type={'password'} required={true} />)
  .add('grouped', () => (
    <TextFieldGroup>
      <TextField />
      <TextField />
      <TextField />
      <TextField />
      <TextField />
    </TextFieldGroup>
  ))
