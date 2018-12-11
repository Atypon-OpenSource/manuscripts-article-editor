import { Formik, FormikActions, FormikErrors } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { feedback } from '../../lib/api/feedback'
import { feedbackSchema } from '../../validation'
import { FormErrors } from '../Form'
import { FeedbackMessage } from '../Messages'
import ModalForm from '../ModalForm'
import { FeedbackForm, FeedbackValues } from './FeedbackForm'

const initialValues: FeedbackValues = {
  message: '',
  title: '',
}

class FeedbackPageContainer extends React.Component<RouteComponentProps<{}>> {
  public render() {
    return (
      <ModalForm title={<FeedbackMessage />}>
        <Formik
          initialValues={initialValues}
          validationSchema={feedbackSchema}
          isInitialValid={true}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={this.handleSubmit}
          component={FeedbackForm}
        />
      </ModalForm>
    )
  }

  private handleSubmit = async (
    values: FeedbackValues,
    { setErrors, setSubmitting }: FormikActions<FeedbackValues | FormErrors>
  ) => {
    setErrors({})
    const { message, title } = values

    try {
      await feedback(message, title)

      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)

      const errors: FormikErrors<FormErrors> = {
        submit: error.response
          ? error.response.data.error
          : 'There was an error',
      }

      setErrors(errors)
    }
  }
}

export default FeedbackPageContainer
