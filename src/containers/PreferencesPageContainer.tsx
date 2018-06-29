import { Formik, FormikActions } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { PreferencesMessage } from '../components/Messages'
import ModalForm from '../components/ModalForm'
import {
  PreferencesErrors,
  PreferencesForm,
  PreferencesValues,
} from '../components/PreferencesForm'
import preferences from '../lib/preferences'
import { IntlProps, withIntl } from '../store/IntlProvider'
import { preferencesSchema } from '../validation'

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
          isInitialValid={false}
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
