import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { AccountValues, DeleteAccountForm } from './DeleteAccountForm'

type Props = FormikConfig<AccountValues>

const DeleteAccountPage: React.SFC<Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    isInitialValid={false}
    onSubmit={onSubmit}
    component={DeleteAccountForm}
  />
)

export default DeleteAccountPage
