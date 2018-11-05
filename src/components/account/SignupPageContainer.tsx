import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse, stringify } from 'qs'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { resendVerificationEmail, signup, verify } from '../../lib/api'
import { UserProps, withUser } from '../../store/UserProvider'
import { signupSchema } from '../../validation'
import { Main, Page } from '../Page'
import { Spinner } from '../Spinner'
import { SignupErrors, SignupValues } from './SignupForm'
import SignupMessages from './SignupMessages'
import SignupPage from './SignupPage'

interface UserDetails {
  email: string
}

interface State {
  confirming: UserDetails | null
  resendSucceed: boolean | null
  existButNotVerified: UserDetails | null
  networkError: boolean | null
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
    networkError: null,
    error: false,
  }

  private initialValues: SignupValues = {
    email: '',
    password: '',
    name: '',
    allowsTracking: false,
  }

  public async componentDidMount() {
    const { token, email } = parse(window.location.hash.substr(1))

    if (token) {
      try {
        await verify(token)

        this.props.history.push(`/login?${stringify({ email })}`, {
          verificationMessage: 'Your account is now verified.',
        })
      } catch (error) {
        this.props.history.push('/login', {
          verificationMessage:
            'Account verification failed. Is the account already verified?',
        })
      }
    }
  }

  public render() {
    const { user } = this.props
    const {
      error,
      confirming,
      existButNotVerified,
      resendSucceed,
      networkError,
    } = this.state

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
            networkError={networkError}
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

  private handleSubmit = async (
    values: SignupValues,
    { setSubmitting, setErrors }: FormikActions<SignupValues | SignupErrors>
  ) => {
    const { name, email, password, allowsTracking } = values

    try {
      await signup(name, email, password, allowsTracking)

      setSubmitting(false)

      this.setState({
        confirming: { email },
        existButNotVerified: null,
      })
    } catch (error) {
      alert(JSON.stringify(error.request))
      setSubmitting(false)

      const errors: FormikErrors<SignupErrors> = {}

      if (error.response) {
        const { data } = error.response

        if (
          data &&
          data.error &&
          data.error.name === 'ConflictingUnverifiedUserExistsError'
        ) {
          this.setState({
            confirming: null,
            existButNotVerified: { email },
          })

          await resendVerificationEmail(email)
        } else {
          errors.submit = this.errorResponseMessage(error.response.status)

          setErrors(errors)
        }
      } else {
        this.setState({ networkError: true })
      }
    }
  }

  private resendVerificationEmail = async () => {
    const { confirming } = this.state

    if (!confirming) return

    const { email } = confirming

    try {
      await resendVerificationEmail(email)

      this.setState({
        resendSucceed: true,
      })
    } catch (error) {
      this.setState({
        resendSucceed: false,
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
