import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { GoogleLogin, OrcidLogin } from '../src/components/Authentication'

storiesOf('Authentication', module)
  .add('Google', () => <GoogleLogin redirect={action('redirect')} />)
  .add('Orcid', () => <OrcidLogin redirect={action('redirect')} />)
