import { FormikActions, FormikErrors } from 'formik'
import React from 'react'
import Modal from 'react-modal'
import { RouteComponentProps } from 'react-router'
import { AccountValues } from '../components/AccountForm'
import AccountPage from '../components/AccountPage'
import { FormErrors } from '../components/Form'
import { modalStyle } from '../components/Manage'
import { Main, Page } from '../components/Page'
import { updateAccount } from '../lib/api'
import { accountSchema } from '../validation'

// TODO: edit email address

class AccountPageContainer extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <Page>
        <Main>
          <Modal isOpen={true} ariaHideApp={false} style={modalStyle}>
            <AccountPage
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

    updateAccount(values).then(
      () => {
        setSubmitting(false)

        this.props.history.push('/')
      },
      error => {
        setSubmitting(false)

        const errors: FormikErrors<FormErrors> = {
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }
}

export default AccountPageContainer
