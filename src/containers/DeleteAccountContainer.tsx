import { FormikActions, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import Modal from 'react-modal'
import { RouteComponentProps } from 'react-router'
import { AccountValues } from '../components/AccountForm'
import DeleteAccountPage from '../components/DeleteAccountPage'
import { FormErrors } from '../components/Form'
import { modalStyle } from '../components/Manage'
import { Main, Page } from '../components/Page'
import { deleteAccount } from '../lib/api'
import token from '../lib/token'
import { accountSchema } from '../validation'

class DeleteAccountContainer extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <Page>
        <Main>
          <Modal isOpen={true} ariaHideApp={false} style={modalStyle}>
            <DeleteAccountPage
              initialValues={{
                password: '',
              }}
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
    { setSubmitting, setErrors }: FormikActions<AccountValues | FormErrors>
  ) => {
    setErrors({})

    deleteAccount(values).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')
      },
      error => {
        setSubmitting(false)
        if (error.response.data.notFound) {
          token.remove()
          window.location.href = '/'
        }

        const errors: FormikErrors<FormErrors> = {
          submit:
            error.response &&
            error.response.status === HttpStatusCodes.UNAUTHORIZED
              ? 'The password entered is incorrect'
              : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }
}

export default DeleteAccountContainer
