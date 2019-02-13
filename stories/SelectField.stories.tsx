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

import { PrimarySubmitButton } from '@manuscripts/style-guide'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Field, Form, Formik } from 'formik'
import React from 'react'
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
