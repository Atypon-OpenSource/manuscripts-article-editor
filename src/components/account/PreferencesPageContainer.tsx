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
