import { Formik, FormikActions, FormikErrors } from 'formik'
import React from 'react'
import Modal from 'react-modal'
import { RouteComponentProps } from 'react-router'
import { modalStyle } from '../components/Manage'
import { Main, Page } from '../components/Page'
import {
  ProfileErrors,
  ProfileForm,
  ProfileValues,
} from '../components/ProfileForm'
import { UserProps, withUser } from '../store/UserProvider'
import { accountSchema } from '../validation'

class ProfilePageContainer extends React.Component<
  UserProps & RouteComponentProps<{}>
> {
  public render() {
    const { user } = this.props

    if (!user.loaded) {
      return null
    }

    if (!user.data) {
      return null
    }

    return (
      <Page>
        <Main>
          <Modal isOpen={true} ariaHideApp={false} style={modalStyle}>
            <Formik
              initialValues={user.data}
              validationSchema={accountSchema}
              isInitialValid={false}
              onSubmit={this.handleSubmit}
              component={ProfileForm}
            />
          </Modal>
        </Main>
      </Page>
    )
  }

  private handleSubmit = (
    values: ProfileValues,
    { setSubmitting, setErrors }: FormikActions<ProfileValues | ProfileErrors>
  ) => {
    setErrors({})

    this.props.user.update(values).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')

        // this.props.user.fetch()
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<ProfileErrors> = {
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }
}

export default withUser(ProfilePageContainer)
