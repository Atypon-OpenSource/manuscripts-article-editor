import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { AccountForm, AccountValues } from './AccountForm'

const AccountPage: React.SFC<FormikConfig<AccountValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    isInitialValid={false}
    onSubmit={onSubmit}
    component={AccountForm}
  />
)

export default AccountPage
