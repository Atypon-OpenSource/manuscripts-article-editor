/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { FormErrors } from '@manuscripts/style-guide'
import { Formik, FormikErrors } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { TokenActions } from '../../data/TokenData'
import { changePassword } from '../../lib/api'
import { changePasswordSchema } from '../../validation'
import { ChangePasswordMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { ChangePasswordForm, ChangePasswordValues } from './ChangePasswordForm'

interface Props {
  tokenActions: TokenActions
}

const ChangePasswordPageContainer: React.FunctionComponent<
  RouteComponentProps & Props
> = ({ history, tokenActions }) => (
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

          history.push('/projects')
        } catch (error) {
          actions.setSubmitting(false)

          const errors: FormikErrors<ChangePasswordValues & FormErrors> = {
            submit:
              error.response &&
              error.response.status === HttpStatusCodes.FORBIDDEN
                ? 'The password entered is incorrect'
                : 'There was an error',
          }
          if (
            error.response &&
            error.response.status === HttpStatusCodes.UNAUTHORIZED
          ) {
            tokenActions.delete()
          } else {
            actions.setErrors(errors)
          }
        }
      }}
      component={ChangePasswordForm}
    />
  </ModalForm>
)

export default ChangePasswordPageContainer
