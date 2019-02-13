/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import AutoSaveInput from '../src/components/AutoSaveInput'
import { TextField, TextFieldGroup } from '../src/components/TextField'
import { TextFieldContainer } from '../src/components/TextFieldContainer'
import {
  TextFieldError,
  TextFieldErrorItem,
} from '../src/components/TextFieldError'
import { TextFieldGroupContainer } from '../src/components/TextFieldGroupContainer'

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

storiesOf('TextField/AutoSave', module)
  .add('on change', () => (
    <Formik
      initialValues={{
        name: '',
      }}
      onSubmit={action('submit')}
    >
      <Form>
        <Field name={'name'}>
          {(props: FieldProps) => (
            <AutoSaveInput
              {...props}
              component={TextField}
              saveOn={'change'}
              placeholder={'Name'}
            />
          )}
        </Field>
      </Form>
    </Formik>
  ))
  .add('on blur', () => (
    <Formik
      initialValues={{
        name: '',
      }}
      onSubmit={action('submit')}
    >
      <Form>
        <TextFieldGroupContainer>
          <Field name={'name'}>
            {(props: FieldProps) => (
              <AutoSaveInput
                {...props}
                component={TextField}
                saveOn={'blur'}
                placeholder={'Name'}
              />
            )}
          </Field>

          <Field name={'email'} type={'email'}>
            {(props: FieldProps) => (
              <AutoSaveInput
                {...props}
                component={TextField}
                saveOn={'blur'}
                placeholder={'Email Address'}
              />
            )}
          </Field>
        </TextFieldGroupContainer>
      </Form>
    </Formik>
  ))

storiesOf('TextField/Container', module)
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

storiesOf('TextField/GroupContainer', module)
  .add('default', () => (
    <TextFieldGroupContainer>
      <TextFieldContainer>
        <TextField name={'foo'} />
      </TextFieldContainer>
      <TextFieldContainer>
        <TextField name={'foo'} />
      </TextFieldContainer>
    </TextFieldGroupContainer>
  ))
  .add('one error', () => (
    <TextFieldGroupContainer
      errors={{
        foo: 'There was an error',
      }}
    >
      <TextField name={'foo'} error={'There was an error'} />
      <TextField name={'bar'} />
    </TextFieldGroupContainer>
  ))
  .add('another error', () => (
    <TextFieldGroupContainer
      errors={{
        foo: 'There was an error',
        baz: 'There was another error',
      }}
    >
      <TextField name={'foo'} error={'There was an error'} />
      <TextField name={'bar'} />
      <TextField name={'baz'} error={'There was another error'} />
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
      <TextField name={'foo'} error={'There was an error'} />
      <TextField name={'bar'} error={'There was another error'} />
      <TextField name={'baz'} error={'There was a third error'} />
    </TextFieldGroupContainer>
  ))

storiesOf('TextField/Error', module).add('default', () => (
  <TextFieldError>
    <TextFieldErrorItem>There was an error</TextFieldErrorItem>
  </TextFieldError>
))
