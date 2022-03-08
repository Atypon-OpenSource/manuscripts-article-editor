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
import { StatusCodes } from 'http-status-codes'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import { logout } from '../../lib/account'
import { markUserForDeletion } from '../../lib/api'
import { isOwner } from '../../lib/roles'
import { TokenActions, useStore } from '../../store'
import { deleteAccountSchema } from '../../validation'
import { DeleteAccountMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { DeleteAccountForm, DeleteAccountValues } from './DeleteAccountForm'

interface Props {
  tokenActions: TokenActions
}

const DeleteAccountPageContainer: React.FunctionComponent<
  Props & RouteComponentProps
> = ({ history, tokenActions }) => {
  const [{ tokenData, projects, user }] = useStore((store) => ({
    tokenData: store.tokenData,
    projects: store.projects,
    user: store.user,
  }))
  return (
    <ModalForm
      title={<DeleteAccountMessage />}
      handleClose={() => history.goBack()}
    >
      <Formik<DeleteAccountValues>
        initialValues={{
          password: '',
        }}
        validationSchema={deleteAccountSchema}
        isInitialValid={true}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, actions) => {
          actions.setErrors({})

          try {
            await markUserForDeletion(values.password)

            actions.setSubmitting(false)

            await logout()

            tokenData.getTokenActions()?.delete()

            window.location.assign('/signup')
          } catch (error) {
            actions.setSubmitting(false)

            const errors: FormikErrors<DeleteAccountValues & FormErrors> = {
              submit:
                error.response &&
                error.response.status === StatusCodes.FORBIDDEN
                  ? 'The password entered is incorrect'
                  : 'There was an error',
            }

            if (
              error.response &&
              error.response.status === StatusCodes.UNAUTHORIZED
            ) {
              tokenActions.delete()
            } else {
              actions.setErrors(errors)
            }
          }
        }}
        render={(props) => (
          <DeleteAccountForm
            {...props}
            deletedProjects={projects.filter(
              (project) =>
                project.owners.length === 1 && isOwner(project, user.userID)
            )}
          />
        )}
      />
    </ModalForm>
  )
}

export default DeleteAccountPageContainer
