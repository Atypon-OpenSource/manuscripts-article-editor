import { storiesOf } from '@storybook/react'
import React from 'react'
import { TextField } from '../src/components/TextField'
import { TextFieldContainer } from '../src/components/TextFieldContainer'
import { TextFieldGroupContainer } from '../src/components/TextFieldGroupContainer'

storiesOf('TextFieldContainer', module)
  .add('default', () => (
    <TextFieldContainer>
      <TextField />
    </TextFieldContainer>
  ))
  .add('with label', () => (
    <TextFieldContainer label={'Name'}>
      <TextField />
    </TextFieldContainer>
  ))
  .add('with error', () => (
    <TextFieldContainer error={'There was an error'}>
      <TextField />
    </TextFieldContainer>
  ))
  .add('grouped', () => (
    <TextFieldGroupContainer
      errors={{
        foo: 'There was an error',
      }}
    >
      <TextFieldContainer>
        <TextField />
      </TextFieldContainer>
      <TextFieldContainer>
        <TextField name={'foo'} />
      </TextFieldContainer>
      <TextFieldContainer>
        <TextField />
      </TextFieldContainer>
    </TextFieldGroupContainer>
  ))
