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
