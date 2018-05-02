import { Formik, FormikConfig } from 'formik'
import React from 'react'
import FooterContainer from '../containers/FooterContainer'
import { Centered } from './Page'
import { PasswordForm, PasswordValues } from './PasswordForm'

const PasswordPage: React.SFC<FormikConfig<PasswordValues>> = ({
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
      component={PasswordForm}
    />

    <FooterContainer />
  </Centered>
)

export default PasswordPage
