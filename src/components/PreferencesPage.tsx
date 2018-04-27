import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import { Centered } from './Page'
import { PreferencesForm, PreferencesValues } from './PreferencesForm'

const PreferencesPage: React.SFC<FormikConfig<PreferencesValues>> = ({
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
