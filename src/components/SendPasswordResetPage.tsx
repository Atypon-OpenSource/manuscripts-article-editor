import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import FooterContainer from '../containers/FooterContainer'
import { Centered } from './Page'
import {
  SendPasswordResetForm,
  SendPasswordResetValues,
} from './SendPasswordResetForm'

const SendPasswordResetPage: React.SFC<
  FormikConfig<SendPasswordResetValues>
> = ({ initialValues, validationSchema, onSubmit }) => (
  <Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
      component={SendPasswordResetForm}
    />

    <FooterContainer />
  </Centered>
)

export default SendPasswordResetPage
