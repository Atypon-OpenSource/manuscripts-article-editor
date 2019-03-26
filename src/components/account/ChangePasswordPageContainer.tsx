/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FormErrors } from '@manuscripts/style-guide'
import { Formik, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { changePassword } from '../../lib/api'
import { changePasswordSchema } from '../../validation'
import { ChangePasswordMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { ChangePasswordForm, ChangePasswordValues } from './ChangePasswordForm'

const ChangePasswordPageContainer: React.FunctionComponent<
  RouteComponentProps
> = ({ history }) => (
  <ModalForm
    title={<ChangePasswordMessage />}
    handleClose={() => history.goBack()}
  >
    <Formik<ChangePasswordValues>
      initialValues={{
        currentPassword: '',
        newPassword: '',
      }}
      validationSchema={changePasswordSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        actions.setErrors({})

        try {
          await changePassword(values.currentPassword, values.newPassword)

          actions.setSubmitting(false)

          history.push('/')
        } catch (error) {
          actions.setSubmitting(false)

          const errors: FormikErrors<ChangePasswordValues & FormErrors> = {
            submit:
              error.response &&
              error.response.status === HttpStatusCodes.FORBIDDEN
                ? 'The password entered is incorrect'
                : 'There was an error',
          }

          actions.setErrors(errors)
        }
      }}
      component={ChangePasswordForm}
    />
  </ModalForm>
)

export default ChangePasswordPageContainer
