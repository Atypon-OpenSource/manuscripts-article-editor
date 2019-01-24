import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { Centered } from '../Page'
import AuthButtonContainer from './AuthButtonContainer'
import { AuthenticationContainer, GoogleLogin } from './Authentication'
import FooterContainer from './FooterContainer'
import { SignupForm, SignupValues } from './SignupForm'

const SignupPage: React.FunctionComponent<FormikConfig<SignupValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik<SignupValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      component={SignupForm}
    />

    <AuthenticationContainer>
      <div>Sign up with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        {/*<AuthButtonContainer component={OrcidLogin} />*/}
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default SignupPage
