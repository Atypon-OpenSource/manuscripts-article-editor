import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { PrimarySubmitButton } from '../src/components/Button'
import { ImmediateSelectField } from '../src/components/ImmediateSelectField'
import { SelectField } from '../src/components/SelectField'

const options = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
]

storiesOf('SelectField', module)
  .add('manual submit', () => (
    <Formik
      initialValues={{
        locale: 'en',
      }}
      onSubmit={action('submit')}
    >
      <Form>
        <Field name={'locale'} component={SelectField} options={options} />
        <div style={{ marginTop: 20 }}>
          <PrimarySubmitButton>Save</PrimarySubmitButton>
        </div>
      </Form>
    </Formik>
  ))
  .add('submit on change', () => (
    <Formik
      initialValues={{
        locale: 'en',
      }}
      onSubmit={action('submit')}
    >
      <Form>
        <Field
          name={'locale'}
          component={ImmediateSelectField}
          options={options}
        />
      </Form>
    </Formik>
  ))
