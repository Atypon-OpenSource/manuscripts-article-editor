import { Formik, FormikActions } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import preferences from '../../lib/preferences'
import { IntlProps, withIntl } from '../../store/IntlProvider'
import { preferencesSchema } from '../../validation'
import { PreferencesMessage } from '../Messages'
import ModalForm from '../ModalForm'
import {
  PreferencesErrors,
  PreferencesForm,
  PreferencesValues,
} from './PreferencesForm'

class PreferencesPageContainer extends React.Component<
  RouteComponentProps<{}> & IntlProps
> {
  public render() {
    const initialValues = preferences.get()

    return (
      <ModalForm title={<PreferencesMessage />}>
        <Formik
          initialValues={initialValues}
          validationSchema={preferencesSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          component={PreferencesForm}
        />
      </ModalForm>
    )
  }

  private handleSubmit = (
    values: PreferencesValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<PreferencesValues | PreferencesErrors>
  ) => {
    setErrors({})

    preferences.set({
      ...preferences.get(),
      ...values,
    })

    this.props.intl.setLocale(values.locale)

    setSubmitting(false)

    this.props.history.push('/')
  }
}

export default withIntl(PreferencesPageContainer)
