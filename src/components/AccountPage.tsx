import { Formik, FormikConfig } from 'formik'
import * as React from 'react'
import { AccountForm, AccountValues } from './AccountForm'
import { Centered } from './Page'

const AccountPage: React.SFC<FormikConfig<AccountValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={false}
      onSubmit={onSubmit}
      component={AccountForm}
    />
  </Centered>
)

export default AccountPage
