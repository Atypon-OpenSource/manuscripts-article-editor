import * as React from 'react'

import { storiesOf } from '@storybook/react'
import {
  FirstTextField,
  LastTextField,
  TextField,
} from '../src/components/TextField'

storiesOf('TextField', module)
  .add('default', () => <TextField />)
  .add('required', () => <TextField required={true} />)
  .add('with placeholder', () => <TextField placeholder={'Enter some text'} />)
  .add('type: email', () => <TextField type={'email'} required={true} />)
  .add('type: password', () => <TextField type={'password'} required={true} />)
  .add('grouped', () => (
    <div>
      <FirstTextField type={'email'} placeholder={'email'} required={true} />
      <LastTextField
        type={'password'}
        placeholder={'password'}
        required={true}
      />
    </div>
  ))
