import { Formik, FormikActions, FormikErrors } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { UserProps, withUser } from '../../store/UserProvider'
import { profileSchema } from '../../validation'
import { ManageProfileMessage } from '../Messages'
import ModalForm from '../ModalForm'
import { ProfileErrors, ProfileForm, ProfileValues } from './ProfileForm'

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
      <ModalForm title={<ManageProfileMessage />}>
        <Formik
          initialValues={user.data}
          validationSchema={profileSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          component={ProfileForm}
        />
      </ModalForm>
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
