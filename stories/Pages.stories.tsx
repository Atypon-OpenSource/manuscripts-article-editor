import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import GroupsPage from '../src/components/GroupsPage'

import CollaboratorsPage from '../src/components/CollaboratorsPage'
import LoginPage from '../src/components/LoginPage'
import ManuscriptsPage from '../src/components/ManuscriptsPage'
import PasswordPage from '../src/components/PasswordPage'
import RecoverPage from '../src/components/RecoverPage'
import SignupPage from '../src/components/SignupPage'
import {
  loginSchema,
  passwordSchema,
  recoverSchema,
  signupSchema,
} from '../src/validation'

/* tslint:disable:no-any */

import groups from './data/groups'
import manuscripts from './data/manuscripts'
import authors from './data/people'

storiesOf('Pages', module)
  .add('Sign up', () => (
    <SignupPage
      initialValues={{ name: '', surname: '', email: '', password: '' }}
      validationSchema={signupSchema}
      onSubmit={action('sign up')}
    />
  ))
  .add('Login', () => (
    <LoginPage
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={action('login')}
    />
  ))
  .add('Recover', () => (
    <RecoverPage
      initialValues={{ email: '' }}
      validationSchema={recoverSchema}
      onSubmit={action('recover')}
    />
  ))
  .add('Set password', () => (
    <PasswordPage
      initialValues={{ password: '' }}
      validationSchema={passwordSchema}
      onSubmit={action('save password')}
    />
  ))
  .add('Manuscripts', () => (
    <ManuscriptsPage
      manuscripts={manuscripts as any}
      addManuscript={action('add manuscript')}
      updateManuscript={() => action('update manuscript')}
      removeManuscript={() => action('remove manuscript')}
    />
  ))
  .add('Manuscripts (empty)', () => (
    <ManuscriptsPage
      manuscripts={[]}
      addManuscript={action('add manuscript')}
      updateManuscript={() => action('update manuscript')}
      removeManuscript={() => action('remove manuscript')}
    />
  ))
  .add('Collaborators', () => (
    <CollaboratorsPage
      collaborators={authors as any}
      addCollaborator={action('add collaborator')}
      updateCollaborator={action('update collaborator')}
      removeCollaborator={action('remove collaborator')}
    />
  ))
  .add('Groups', () => (
    <GroupsPage
      groups={groups as any}
      addGroup={action('add group')}
      updateGroup={() => action('update group')}
      removeGroup={() => action('remove group')}
    />
  ))
