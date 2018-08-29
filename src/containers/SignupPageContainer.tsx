import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import { SignupErrors, SignupValues } from '../components/SignupForm'
import SignupMessages from '../components/SignupMessages'
import SignupPage from '../components/SignupPage'
import { Spinner } from '../components/Spinner'
import { resendVerificationEmail, signup, verify } from '../lib/api'
import { UserProps, withUser } from '../store/UserProvider'
import { signupSchema } from '../validation'

interface UserDetails {
  email: string
}

interface State {
  confirming: UserDetails | null
  resendSucceed: boolean | null
  existButNotVerified: UserDetails | null
  error: boolean
}

class SignupPageContainer extends React.Component<
  UserProps & RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {
    confirming: null,
    resendSucceed: null,
    existButNotVerified: null,
    error: false,
  }

  private initialValues: SignupValues = {
    email: '',
    password: '',
    name: '',
    allowsTracking: false,
  }

  public componentDidMount() {
    const { token: verifyEmailToken } = parse(window.location.hash.substr(1))

    if (verifyEmailToken) {
      verify({
        token: verifyEmailToken,
      })
        .then(() => {
          this.props.history.push('/login', {
            verificationMessage: 'Your account is now verified.',
          })
        })
        .catch(() => {
          this.setState({
            error: true,
          })
          this.props.history.push('/login', {
            verificationMessage:
              'Account verification failed. Is the account already verified?',
          })
        })
    }
  }

  public render() {
    const { user } = this.props
    const { error, confirming, existButNotVerified, resendSucceed } = this.state

    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/'} />
    }

    if (error) {
      return <FormattedMessage id={'error'} />
    }

    return (
      <Page>
        <Main>
          <SignupMessages
            confirming={confirming}
            existButNotVerified={existButNotVerified}
            resendSucceed={resendSucceed}
            resendVerificationEmail={this.resendVerificationEmail}
          />
          <SignupPage
            initialValues={this.initialValues}
            onSubmit={this.handleSubmit}
            validationSchema={signupSchema}
          />
        </Main>
      </Page>
    )
  }

  private handleSubmit = (
    values: SignupValues,
    { setSubmitting, setErrors }: FormikActions<SignupValues | SignupErrors>
  ) => {
    signup(values).then(
      () => {
        setSubmitting(false)

        this.setState({
          confirming: { email: values.email },
          existButNotVerified: null,
        })

        this.props.user.fetch()
      },
      async error => {
        setSubmitting(false)

        const errors: FormikErrors<SignupErrors> = {}

        if (error.response) {
          const { data } = error.response
          const { email } = values

          if (data.error.name === 'ConflictingUnverifiedUserExistsError') {
            this.setState({
              confirming: null,
              existButNotVerified: { email },
            })

            await resendVerificationEmail(email)
          } else {
            errors.submit = this.errorResponseMessage(error.response.status)

            setErrors(errors)
          }
        }
      }
    )
  }

  private resendVerificationEmail = () => {
    const { confirming } = this.state
    if (confirming) {
      resendVerificationEmail(confirming.email)
        .then(() => {
          this.setState({
            resendSucceed: true,
          })
        })
        .catch(() => {
          this.setState({
            resendSucceed: false,
          })
        })
    }
  }

  private errorResponseMessage = (status: number) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.CONFLICT:
        return 'The email address is already registered'

      default:
        return 'An error occurred.'
    }
  }
}

export default withUser(SignupPageContainer)
