import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import { SignupConfirm } from '../components/SignupConfirm'
import { SignupErrors, SignupValues } from '../components/SignupForm'
import SignupPage from '../components/SignupPage'
import { Spinner } from '../components/Spinner'
import { signup, verify } from '../lib/api'
import { UserProps, withUser } from '../store/UserProvider'
import { signupSchema } from '../validation'

interface UserDetails {
  email: string
}

interface State {
  confirming: UserDetails | null
  error: boolean
}

class SignupPageContainer extends React.Component<
  UserProps & RouteComponentProps<{}>,
  State
> {
  public state: Readonly<State> = {
    confirming: null,
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
    const { confirming, error } = this.state

    if (!user.loaded) {
      return <Spinner />
    }

    if (user.data) {
      return <Redirect to={'/'} />
    }

    if (error) {
      return <FormattedMessage id={'error'} />
    }

    if (confirming) {
      return (
        <Page>
          <SignupConfirm email={confirming.email} />
        </Page>
      )
    }

    return (
      <Page>
        <Main>
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
      response => {
        setSubmitting(false)

        this.setState({
          confirming: { email: values.email },
        })

        this.props.user.fetch()
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<SignupErrors> = {}

        if (error.response) {
          errors.submit = this.errorResponseMessage(error.response.status)
        }

        setErrors(errors)
      }
    )
  }

  private errorResponseMessage = (status: number) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.CONFLICT:
        // TODO: a button to re-send the confirmation email
        return 'The email address is already registered'

      default:
        return 'An error occurred.'
    }
  }
}

export default withUser(SignupPageContainer)
