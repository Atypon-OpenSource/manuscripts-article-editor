import { FormikActions, FormikErrors } from 'formik'
import React from 'react'
import Modal from 'react-modal'
import { RouterProps } from 'react-router'
import { AccountErrors, AccountValues } from '../components/AccountForm'
import AccountPage from '../components/AccountPage'
import { modalStyle } from '../components/Manage'
import { IconBar, Main, Page } from '../components/Page'
import { UserProps, withUser } from '../store/UserProvider'
import { User } from '../types/user'
import { accountSchema } from '../validation'
import SidebarContainer from './SidebarContainer'

class AccountPageContainer extends React.Component<UserProps & RouterProps> {
  public render() {
    const initialValues = this.props.user.data as User

    // TODO: remove this once the User object has the correct fields
    if (initialValues.name && !initialValues.givenName) {
      ;[
        initialValues.givenName,
        initialValues.familyName,
      ] = initialValues.name.split(/\s+/, 2)
    }

    if (!initialValues.phone) {
      initialValues.phone = ''
    }

    return (
      <Page>
        <IconBar />
        <SidebarContainer />

        <Main>
          <Modal isOpen={true} ariaHideApp={false} style={modalStyle}>
            <AccountPage
              initialValues={initialValues}
              validationSchema={accountSchema}
              onSubmit={this.handleSubmit}
            />
          </Modal>
        </Main>
      </Page>
    )
  }

  private handleSubmit = (
    values: AccountValues,
    { setSubmitting, setErrors }: FormikActions<AccountValues | AccountErrors>
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

        const errors: FormikErrors<AccountErrors> = {
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }
}

export default withUser(AccountPageContainer)
