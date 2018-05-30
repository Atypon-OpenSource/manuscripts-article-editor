import { storiesOf } from '@storybook/react'
import React from 'react'
import { TextField } from '../src/components/TextField'
import { TextFieldContainer } from '../src/components/TextFieldContainer'
import { TextFieldGroupContainer } from '../src/components/TextFieldGroupContainer'

storiesOf('TextFieldGroupContainer', module)
  .add('default', () => (
    <TextFieldGroupContainer>
      <TextFieldContainer>
        <TextField />
      </TextFieldContainer>
      <TextFieldContainer>
        <TextField />
      </TextFieldContainer>
    </TextFieldGroupContainer>
  ))
  .add('one error', () => (
    <TextFieldGroupContainer
      errors={{
        foo: 'There was an error',
      }}
    >
      <TextField error={'There was an error'} />
      <TextField />
    </TextFieldGroupContainer>
  ))
  .add('another error', () => (
    <TextFieldGroupContainer
      errors={{
        foo: 'There was an error',
        bar: 'There was another error',
      }}
    >
      <TextField error={'There was an error'} />
      <TextField />
      <TextField error={'There was another error'} />
    </TextFieldGroupContainer>
  ))
  .add('multiple errors', () => (
    <TextFieldGroupContainer
      errors={{
        foo: 'There was an error',
        bar: 'There was another error',
        baz: 'There was a third error',
      }}
    >
      <TextField error={'There was an error'} />
      <TextField error={'There was another error'} />
      <TextField error={'There was a third error'} />
    </TextFieldGroupContainer>
  ))
