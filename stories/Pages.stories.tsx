import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import HomePage from '../src/components/HomePage'

import CollaboratorsPage from '../src/components/CollaboratorsPage'
import ManuscriptsPage from '../src/components/ManuscriptsPage'

import manuscripts from './data/manuscripts'
import people from './data/people'

storiesOf('Pages', module)
  .add('Home', () => <HomePage />)
  .add('Collaborators', () => (
    <CollaboratorsPage
      collaborators={people}
      addCollaborator={action('add collaborator')}
      updateCollaborator={action('update collaborator')}
      removeCollaborator={action('remove collaborator')}
    />
  ))
  .add('Manuscripts', () => (
    <ManuscriptsPage
      manuscripts={manuscripts}
      addManuscript={action('add manuscript')}
      updateManuscript={action('update manuscript')}
      removeManuscript={action('remove manuscript')}
    />
  ))
