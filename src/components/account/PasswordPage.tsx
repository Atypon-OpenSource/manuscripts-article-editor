import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { Centered } from '../Page'
import FooterContainer from './FooterContainer'
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
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      component={PasswordForm}
    />

    <FooterContainer />
  </Centered>
)

export default PasswordPage
