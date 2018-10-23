import { Formik, FormikActions, FormikProps } from 'formik'
import React from 'react'
import { PopperChildrenProps } from 'react-popper'
import { projectInvite } from '../../lib/api/collaboration'
import { styled } from '../../theme'
import { Contributor, Project } from '../../types/models'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import {
  InvitationErrors,
  InvitationForm,
  InvitationValues,
} from '../collaboration/InvitationForm'
import { CustomUpPopper, PopperBody } from '../Popper'

interface Props {
  popperProps: PopperChildrenProps
  project: Project
  author: Contributor
  updateAuthor: (author: Contributor, email: string) => void
}

interface State {
  invitationError: Error | null
}

const AlertMessageContainer = styled.div`
  margin-bottom: 9px;
`

class InviteAuthorPopperContainer extends React.Component<Props> {
  public state: State = {
    invitationError: null,
  }
  public render() {
    const { popperProps } = this.props
    const { invitationError } = this.state
    return (
      <CustomUpPopper popperProps={popperProps}>
        <PopperBody>
          {!!invitationError && (
            <AlertMessageContainer>
              <AlertMessage
                type={AlertMessageType.error}
                hideCloseButton={true}
              >
                Sending invitation failed.
              </AlertMessage>
            </AlertMessageContainer>
          )}
          <Formik
            initialValues={{
              email: this.props.author.email || '',
              name:
                this.props.author.bibliographicName.given +
                ' ' +
                this.props.author.bibliographicName.family,
              role: 'Writer',
            }}
            onSubmit={this.handleInvitationSubmit}
            isInitialValid={true}
            validateOnChange={false}
            validateOnBlur={false}
            render={(
              props: FormikProps<InvitationValues & InvitationErrors>
            ) => <InvitationForm {...props} disabled={false} />}
          />
        </PopperBody>
      </CustomUpPopper>
    )
  }

  private handleInvitationSubmit = async (
    values: InvitationValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<InvitationValues | InvitationErrors>
  ) => {
    const { project } = this.props
    const { email, name, role } = values

    try {
      await projectInvite(project._id, [{ email, name }], role)
      this.props.updateAuthor(this.props.author, email)
    } catch (error) {
      this.setState({ invitationError: error })
    } finally {
      setSubmitting(false)
    }
  }
}

export default InviteAuthorPopperContainer
