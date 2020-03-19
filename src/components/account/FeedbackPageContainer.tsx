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
import { feedback } from '../../lib/api/feedback'
import { feedbackSchema } from '../../validation'
import { FeedbackMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { FeedbackForm, FeedbackValues } from './FeedbackForm'

interface Props {
  tokenActions: TokenActions
}

const FeedbackPageContainer: React.FunctionComponent<RouteComponentProps &
  Props> = ({ history, tokenActions }) => (
  <ModalForm title={<FeedbackMessage />} handleClose={() => history.goBack()}>
    <Formik<FeedbackValues>
      initialValues={{
        message: '',
        title: '',
      }}
      validationSchema={feedbackSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, actions) => {
        actions.setErrors({})

        const { message, title } = values

        try {
          await feedback(message, title)

          actions.setSubmitting(false)
        } catch (error) {
          actions.setSubmitting(false)

          const errors: FormikErrors<FeedbackValues & FormErrors> = {
            submit: error.response
              ? error.response.data.error
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
      component={FeedbackForm}
    />
  </ModalForm>
)

export default FeedbackPageContainer
