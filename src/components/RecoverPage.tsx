import { Formik, FormikConfig } from 'formik'
import React from 'react'
import FooterContainer from '../containers/FooterContainer'
import { Centered } from './Page'
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
      isInitialValid={false}
      onSubmit={onSubmit}
      component={RecoverForm}
    />

    <FooterContainer />
  </Centered>
)

export default RecoverPage
