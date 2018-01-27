import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import AuthButtonContainer from '../containers/AuthButtonContainer'
import FooterContainer from '../containers/FooterContainer'
import { AuthenticationContainer, GoogleLogin } from './Authentication'
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

    <AuthenticationContainer>
      <div>Sign up with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </React.Fragment>
)

export default SignupPage
