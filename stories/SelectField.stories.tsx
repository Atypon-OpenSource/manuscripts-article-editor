/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { PrimaryButton } from '@manuscripts/style-guide'
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
          <PrimaryButton type="submit">Save</PrimaryButton>
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
