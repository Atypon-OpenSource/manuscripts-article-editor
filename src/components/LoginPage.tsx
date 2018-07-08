import { Formik, FormikConfig } from 'formik'
import React from 'react'
import AuthButtonContainer from '../containers/AuthButtonContainer'
import FooterContainer from '../containers/FooterContainer'
import CloseGreen from '../icons/close-green'
import CloseRed from '../icons/close-red'

import AttentionRed from '../icons/attention-red'
import SuccessGreen from '../icons/success'

import {
  AuthenticationContainer,
  GoogleLogin,
  OrcidLogin,
} from './Authentication'
import {
  CloseIcon,
  FormError,
  FormMessage,
  FormSuccess,
  InformativeIcon,
} from './Form'
import { LoginForm, LoginValues } from './LoginForm'
import { Centered } from './Page'

interface Props {
  verificationMessage: string
  onClose: () => void
}

const LoginPage: React.SFC<FormikConfig<LoginValues> & Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  onClose,
  verificationMessage,
}) => (
  <Centered>
    {verificationMessage &&
      verificationMessage ===
        'Account verification failed. Is the account already verified?' && (
        <FormError>
          <InformativeIcon>
            <AttentionRed />
          </InformativeIcon>
          <FormMessage>{verificationMessage}</FormMessage>
          <CloseIcon onClick={onClose}>
            <CloseRed />
          </CloseIcon>
        </FormError>
      )}
    {verificationMessage &&
      verificationMessage === 'Your account is now verified.' && (
        <FormSuccess>
          <InformativeIcon>
            <SuccessGreen />
          </InformativeIcon>
          <FormMessage>{verificationMessage}</FormMessage>
          <CloseIcon onClick={onClose}>
            <CloseGreen />
          </CloseIcon>
        </FormSuccess>
      )}
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
      component={LoginForm}
    />

    <AuthenticationContainer>
      <div>Sign in with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        <AuthButtonContainer component={OrcidLogin} />
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default LoginPage
