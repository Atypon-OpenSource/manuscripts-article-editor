import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { Centered } from '../Page'
import FooterContainer from './FooterContainer'
import { RecoverForm, RecoverValues } from './RecoverForm'

const RecoverPage: React.SFC<FormikConfig<RecoverValues>> = ({
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
      component={RecoverForm}
    />

    <FooterContainer />
  </Centered>
)

export default RecoverPage
