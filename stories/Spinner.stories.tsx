import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { LoadableSpinner } from '../src/components/LoadableSpinner'
import Spinner from '../src/icons/spinner'

storiesOf('Spinner', module)
  .add('default', () => <Spinner />)
  .add('color', () => <Spinner color={'red'} />)
  .add('size', () => <Spinner size={200} />)

storiesOf('Spinner/Loadable Spinner', module).add('Button', () => (
  <LoadableSpinner
    isLoading={true}
    timedOut={false}
    pastDelay={true}
    retry={action('retry')}
    error={{}}
  />
))
