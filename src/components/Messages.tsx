import React from 'react'
import { FormattedMessage } from 'react-intl'

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
    defaultMessage={'Manage profile'}
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
      'Select a collaborator from the list at the left to display the details here.'
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
}> = ({ email }) => (
  <FormattedMessage
    id={'signup_verify_resend_success'}
    defaultMessage={
      'Verification email re-resent to {email}. If you have not received it, please wait, check your spam box before getting in touch via support@manuscriptsapp.com.'
    }
    values={{ email }}
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
