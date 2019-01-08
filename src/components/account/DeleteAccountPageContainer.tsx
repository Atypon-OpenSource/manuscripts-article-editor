import { Formik } from 'formik'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import ProjectsData from '../../data/ProjectsData'
import UserData from '../../data/UserData'
import { logout } from '../../lib/account'
import { deleteAccount } from '../../lib/api'
import { databaseCreator } from '../../lib/db'
import { isOwner } from '../../lib/roles'
import { getCurrentUserId } from '../../lib/user'
import { deleteAccountSchema } from '../../validation'
import { FormErrors } from '../Form'
import { DeleteAccountMessage } from '../Messages'
import ModalForm from '../ModalForm'
import { DeleteAccountForm, DeleteAccountValues } from './DeleteAccountForm'

const DeleteAccountPageContainer = () => (
  <ProjectsData>
    {projects => (
      <UserData userID={getCurrentUserId()!}>
        {user => (
          <ModalForm title={<DeleteAccountMessage />}>
            <Formik<DeleteAccountValues & FormErrors>
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

                  const db = await databaseCreator

                  await logout(db)

                  window.location.href = '/signup'
                } catch (error) {
                  actions.setSubmitting(false)

                  const errors = {
                    submit:
                      error.response &&
                      error.response.status === HttpStatusCodes.UNAUTHORIZED
                        ? 'The password entered is incorrect'
                        : 'There was an error',
                  }

                  actions.setErrors(errors)
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
