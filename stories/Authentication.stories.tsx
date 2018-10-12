import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  GoogleLogin,
  OrcidLogin,
} from '../src/components/account/Authentication'

storiesOf('Account/Authentication', module)
  .add('Google', () => <GoogleLogin redirect={action('redirect')} />)
  .add('Orcid', () => <OrcidLogin redirect={action('redirect')} />)
