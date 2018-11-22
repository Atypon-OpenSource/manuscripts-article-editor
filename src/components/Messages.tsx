import React from 'react'
import { FormattedMessage } from 'react-intl'
import config from '../config'

export const SignInMessage = () => (
  <FormattedMessage
    id={'sign_in'}
    description={'Title of sign in page'}
    defaultMessage={'Sign in'}
  />
)

export const SignOutMessage = () => (
  <FormattedMessage
    id={'sign_out'}
    description={'Title of sign out page'}
    defaultMessage={'Sign out'}
  />
)

export const ManageProfileMessage = () => (
  <FormattedMessage
    id={'manage_profile'}
    description={'Title of profile management page'}
    defaultMessage={'Details'}
  />
)

export const PreferencesMessage = () => (
  <FormattedMessage
    id={'preferences'}
    description={'Title of preferences page'}
    defaultMessage={'Preferences'}
  />
)

export const ManuscriptsTitleMessage = () => (
  <FormattedMessage
    id={'manuscripts'}
    description={'Title of the manuscripts overview page'}
    defaultMessage={'Manuscripts'}
  />
)

export const EmptyManuscriptsMessage = () => (
  <FormattedMessage
    id={'empty_manuscripts'}
    description={'Message shown when the manuscripts list is empty'}
    defaultMessage={'No manuscripts yet.'}
  />
)

export const ImportManuscriptMessage = () => (
  <FormattedMessage
    id={'import_manuscript'}
    description={'Additional message shown when the manuscripts list is empty'}
    defaultMessage={
      'Use the + button to create a new Manuscript or import one from your computer.'
    }
  />
)

export const ChangePasswordMessage = () => (
  <FormattedMessage
    id={'change_password'}
    description={'Title of change password page'}
    defaultMessage={'Change password'}
  />
)

export const DeleteAccountMessage = () => (
  <FormattedMessage
    id={'delete_account'}
    description={'Title of delete account page'}
    defaultMessage={'Delete account'}
  />
)

export const SelectCollaboratorMessage = () => (
  <FormattedMessage
    id={'select_collaborator'}
    defaultMessage={
      'Select a collaborator from the list to display their details here.'
    }
  />
)

export const AddCollaboratorsMessage = () => (
  <FormattedMessage
    id={'add_collaborators'}
    defaultMessage={
      'You can add collaborators from the people list or send out invitation mails to those not yet in the list.'
    }
  />
)

export const AddedCollaboratorsMessage: React.SFC<{ addedCount: number }> = ({
  addedCount,
}) => (
  <FormattedMessage
    id={'added_collaborators'}
    defaultMessage={`You added {addedCount, number} {addedCount, plural,
                      one {collaborator}
                      other {collaborators}
                    }`}
    values={{ addedCount }}
  />
)

export const AddAuthorsMessage = () => (
  <FormattedMessage
    id={'add_authors'}
    defaultMessage={
      'Add authors to your author list from your collaborators, or invite new ones'
    }
  />
)
export const SelectAuthorMessage = () => (
  <FormattedMessage
    id={'select_author'}
    defaultMessage={
      'Select an author from the list to display their details here.'
    }
  />
)

export const AddedAuthorsMessage: React.SFC<{ addedCount: number }> = ({
  addedCount,
}) => (
  <FormattedMessage
    id={'added_authors'}
    defaultMessage={`You added {addedCount, number} {addedCount, plural, one {author} other {authors}}`}
    values={{ addedCount }}
  />
)
export const CheckCollaboratorsSearchMessage: React.SFC<{
  searchText: string
}> = ({ searchText }) => (
  <FormattedMessage
    id={'check_collaborators_search'}
    defaultMessage={`Check that the name or email are correct or invite "{searchText}" to
          join as new Collaborator.`}
    values={{ searchText }}
  />
)

export const InviteCollaboratorsMessage = () => (
  <FormattedMessage
    id={'invite_collaborators'}
    defaultMessage={
      'You can invite collaborators by sending email to the users you want to add.'
    }
  />
)

export const SignupVerifyMessage: React.SFC<{
  email: string
}> = ({ email }) => (
  <FormattedMessage
    id={'signup_verify'}
    defaultMessage={
      'Thanks for signing up! Please click the link sent to {email} to verify your account.'
    }
    values={{ email }}
  />
)

export const SignupVerifyResendSuccessMessage: React.SFC<{
  email: string
  supportEmail: string
}> = ({ email, supportEmail }) => (
  <FormattedMessage
    id={'signup_verify_resend_success'}
    defaultMessage={
      'Verification email re-resent to {email}. If you have not received it, please wait, check your spam box before getting in touch via {supportEmail}.'
    }
    values={{ email, supportEmail }}
  />
)

export const SignupVerifyResendFailureMessage: React.SFC<{
  email: string
}> = ({ email }) => (
  <FormattedMessage
    id={'signup_verify_resend_failure'}
    defaultMessage={'Failed to re-send verification email to {email}.'}
    values={{ email }}
  />
)

export const SignupVerifyConflictMessage: React.SFC<{
  email: string
}> = ({ email }) => (
  <FormattedMessage
    id={'signup_verify_conflict'}
    defaultMessage={
      'Account already exists with {email}. Verification email has been re-sent to your email address.'
    }
    values={{ email }}
  />
)

export const AcceptedInvitationSuccessMessage: React.SFC = () => (
  <FormattedMessage
    id={'accepted_invitation_success'}
    defaultMessage={
      'An invitation was accepted successfully, you can find the project in the projects list.'
    }
  />
)

export const AcceptedInvitationFailureMessage: React.SFC = () => (
  <FormattedMessage
    id={'accepted_invitation_failure'}
    defaultMessage={
      'Please sign in with the invited email address to accept this invitation.'
    }
  />
)

export const NetworkErrorMessage: React.SFC = () => (
  <FormattedMessage
    id={'network_error'}
    defaultMessage={
      'Failed to connect to service. Please check your network connection before trying again, and if the problem persists contact {email}.'
    }
    values={{ email: config.support.email }}
  />
)

export const GatewayInaccessibleMessage: React.SFC = () => (
  <FormattedMessage
    id={'gateway_error'}
    defaultMessage={
      'Trouble reaching manuscripts.io servers. Please try again later.'
    }
  />
)
