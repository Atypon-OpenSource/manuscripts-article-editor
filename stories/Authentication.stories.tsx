import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { GoogleLogin, OrcidLogin } from '../src/components/Authentication'

storiesOf('Authentication', module)
  .add('Google', () => <GoogleLogin openWindow={action('open window')} />)
  .add('Orcid', () => <OrcidLogin openWindow={action('open window')} />)
