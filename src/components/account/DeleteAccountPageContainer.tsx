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
import ProjectsData from '../../data/ProjectsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import { logout } from '../../lib/account'
import { deleteAccount } from '../../lib/api'
import { isOwner } from '../../lib/roles'
import { getCurrentUserId } from '../../lib/user'
import { deleteAccountSchema } from '../../validation'
import { DeleteAccountMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { DeleteAccountForm, DeleteAccountValues } from './DeleteAccountForm'

interface Props {
  tokenActions: TokenActions
}

const DeleteAccountPageContainer: React.FunctionComponent<
  Props & RouteComponentProps
> = ({ history, tokenActions }) => (
  <ProjectsData>
    {projects => (
      <UserData userID={getCurrentUserId()!}>
        {user => (
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
                  await deleteAccount(values.password)

                  actions.setSubmitting(false)

                  await logout()

                  tokenActions.delete()

                  window.location.href = '/signup'
                } catch (error) {
                  actions.setSubmitting(false)

                  const errors: FormikErrors<
                    DeleteAccountValues & FormErrors
                  > = {
                    submit:
                      error.response &&
                      error.response.status === HttpStatusCodes.FORBIDDEN
                        ? 'The password entered is incorrect'
                        : 'There was an error',
                  }

                  if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
                    tokenActions.delete()
                  } else {
                    actions.setErrors(errors)
                  }
                }
              }}
              render={props => (
                <DeleteAccountForm
                  {...props}
                  deletedProjects={projects.filter(
                    project =>
                      project.owners.length === 1 &&
                      isOwner(project, user.userID)
                  )}
                />
              )}
            />
          </ModalForm>
        )}
      </UserData>
    )}
  </ProjectsData>
)

export default DeleteAccountPageContainer
