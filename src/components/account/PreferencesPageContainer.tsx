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

import { Formik } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import preferences from '../../lib/preferences'
import { preferencesSchema } from '../../validation'
import { IntlContext } from '../IntlProvider'
import { PreferencesMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { PreferencesForm, PreferencesValues } from './PreferencesForm'

export const PreferencesPageContainer: React.FunctionComponent<
  RouteComponentProps
> = ({ history }) => (
  <IntlContext.Consumer>
    {intl => (
      <ModalForm
        title={<PreferencesMessage />}
        handleClose={() => history.goBack()}
      >
        <Formik<PreferencesValues>
          initialValues={preferences.get()}
          validationSchema={preferencesSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, actions) => {
            actions.setErrors({})

            preferences.set({
              ...preferences.get(),
              ...values,
            })

            intl.setLocale(values.locale)

            actions.setSubmitting(false)

            history.push('/')
          }}
          component={PreferencesForm}
        />
      </ModalForm>
    )}
  </IntlContext.Consumer>
)
