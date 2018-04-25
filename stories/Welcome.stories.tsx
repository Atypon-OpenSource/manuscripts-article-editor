import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { WelcomePage } from '../src/components/WelcomePage'
import { recentFiles } from './data/recent-files'

storiesOf('Welcome', module).add('Modal', () => (
  <WelcomePage
    recentFiles={recentFiles}
    handleHideWelcomeChange={action('hide welcome')}
    createNewManuscript={action('create new manuscript')}
    sendFeedback={action('send feedback')}
    openManuscript={action('open manuscript')}
    handleClose={action('close')}
  />
))
