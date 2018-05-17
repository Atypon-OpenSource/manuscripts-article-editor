import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { RouterProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import { SignupConfirm } from '../components/SignupConfirm'
import { SignupErrors, SignupValues } from '../components/SignupForm'
import SignupPage from '../components/SignupPage'
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

type Props = UserProps & RouterProps

class SignupPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    confirming: null,
    error: false,
  }

  private initialValues: SignupValues = {
    email: '',
    password: '',
    name: '',
  }

  public componentDidMount() {
    const { token: verifyEmailToken } = parse(window.location.hash.substr(1))

    if (verifyEmailToken) {
      verify({
        token: verifyEmailToken,
      })
        .then(() => {
          this.props.history.push('/login')
        })
        .catch(() => {
          this.setState({
            error: true,
          })
        })
    }
  }

  public render() {
    const { user } = this.props
    const { confirming, error } = this.state

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
          // TODO: a button to re-send the confirmation email
          if (error.response.status === HttpStatusCodes.BAD_REQUEST) {
            errors.submit = 'Invalid Operation'
          } else if (error.response.status === HttpStatusCodes.CONFLICT) {
            errors.submit = 'The email address already registered'
          } else {
            errors.submit = 'An error occurred.'
          }
        }

        setErrors(errors)
      }
    )
  }
}

export default withUser(SignupPageContainer)
