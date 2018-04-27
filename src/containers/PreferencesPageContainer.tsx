import { FormikActions } from 'formik'
import * as React from 'react'
// import * as Modal from 'react-modal'
import { RouterProps } from 'react-router'
import {
  PreferencesErrors,
  PreferencesValues,
} from '../components/PreferencesForm'
import PreferencesPage from '../components/PreferencesPage'
import preferences from '../lib/preferences'
import { IntlProps, withIntl } from '../store/IntlProvider'
import { preferencesSchema } from '../validation'

class PreferencesPageContainer extends React.Component<
  RouterProps & IntlProps
> {
  public render() {
    const initialValues = preferences.get()

    return (
      // <Modal isOpen={true} style={modalStyle}>
      <PreferencesPage
        initialValues={initialValues}
        validationSchema={preferencesSchema}
        onSubmit={this.handleSubmit}
      />
      // </Modal>
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
