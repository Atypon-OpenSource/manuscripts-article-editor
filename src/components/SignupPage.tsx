import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import AuthButtonContainer from '../containers/AuthButtonContainer'
import FooterContainer from '../containers/FooterContainer'
import {
  AuthenticationContainer,
  GoogleLogin,
  OrcidLogin,
} from './Authentication'
import { Centered } from './Page'
import { SignupForm, SignupValues } from './SignupForm'

const SignupPage: React.SFC<FormikConfig<SignupValues>> = ({
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
      component={SignupForm}
    />

    <AuthenticationContainer>
      <div>Sign up with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        <AuthButtonContainer component={OrcidLogin} />
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default SignupPage
