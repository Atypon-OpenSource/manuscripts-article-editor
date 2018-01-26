import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import FooterContainer from '../containers/FooterContainer'
import { AuthContainer, GoogleLogin } from './Authentication'
import { SignupForm, SignupValues } from './SignupForm'

const SignupPage: React.SFC<FormikConfig<SignupValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <React.Fragment>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
      component={SignupForm}
    />

    <AuthContainer>
      <div>Sign up with</div>
      <div>
        <GoogleLogin />
      </div>
    </AuthContainer>

    <FooterContainer />
  </React.Fragment>
)

export default SignupPage
