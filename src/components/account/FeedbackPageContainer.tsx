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

import { Formik, FormikErrors } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { feedback } from '../../lib/api/feedback'
import { feedbackSchema } from '../../validation'
import { FormErrors } from '../Form'
import { FeedbackMessage } from '../Messages'
import { ModalForm } from '../ModalForm'
import { FeedbackForm, FeedbackValues } from './FeedbackForm'

const FeedbackPageContainer: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => (
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

          actions.setErrors(errors)
        }
      }}
      component={FeedbackForm}
    />
  </ModalForm>
)

export default FeedbackPageContainer
