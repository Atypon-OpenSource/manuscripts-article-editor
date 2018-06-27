import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { ChangePasswordForm, ChangePasswordValues } from './ChangePasswordForm'

type Props = FormikConfig<ChangePasswordValues>

const ChangePasswordPage: React.SFC<Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    isInitialValid={false}
    onSubmit={onSubmit}
    component={ChangePasswordForm}
  />
)

export default ChangePasswordPage
