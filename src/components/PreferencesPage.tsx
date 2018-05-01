import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { Centered } from './Page'
import { PreferencesForm, PreferencesValues } from './PreferencesForm'

type FormProps = FormikConfig<PreferencesValues>

const PreferencesPage: React.SFC<FormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
      component={PreferencesForm}
    />
  </Centered>
)

export default PreferencesPage
