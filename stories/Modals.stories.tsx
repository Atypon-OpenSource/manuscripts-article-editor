import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { AuthorDetails } from '../src/components/AuthorDetails'
import { Authors } from '../src/components/Authors'
import { Manage } from '../src/components/Manage'
import authors from './data/people'

const author = authors[0]

storiesOf('Modals', module).add(
  'Manage Authors > Add from Collaborators',
  () => (
    <Manage
      isOpen={true}
      heading={'Manage Authors'}
      subheading={'Add from Collaborators'}
      sidebar={<Authors authors={authors} />}
      main={<AuthorDetails author={author} />}
      handleCancel={action('cancel')}
      handleClose={action('close')}
      handleDone={action('done')}
    />
  )
)
