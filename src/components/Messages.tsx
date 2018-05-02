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

export const ManageAccountMessage = () => (
  <FormattedMessage
    id={'manage_account'}
    description={'Title of account management page'}
    defaultMessage={'Manage account'}
  />
)

export const PreferencesMessage = () => (
  <FormattedMessage
    id={'preferences'}
    description={'Title of preferences page'}
    defaultMessage={'Preferences'}
  />
)

export const CollaboratorsTitleMessage = () => (
  <FormattedMessage
    id={'collaborators'}
    description={'Title of the collaborators overview page'}
    defaultMessage={'Collaborators'}
  />
)

export const GroupsTitleMessage = () => (
  <FormattedMessage
    id={'groups'}
    description={'Title of the groups overview page'}
    defaultMessage={'Groups'}
  />
)

export const ManuscriptsTitleMessage = () => (
  <FormattedMessage
    id={'manuscripts'}
    description={'Title of the manuscripts overview page'}
    defaultMessage={'Manuscripts'}
  />
)

export const EmptyCollaboratorsMessage = () => (
  <FormattedMessage
    id={'empty_collaborators'}
    description={'Message shown when the collaborators list is empty'}
    defaultMessage={'No collaborators yet.'}
  />
)

export const EmptyGroupsMessage = () => (
  <FormattedMessage
    id={'empty_groups'}
    description={'Message shown when the groups list is empty'}
    defaultMessage={'No groups yet.'}
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
