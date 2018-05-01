import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { AccountForm, AccountValues } from './AccountForm'

type Props = FormikConfig<AccountValues>

const AccountPage: React.SFC<Props> = ({
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
