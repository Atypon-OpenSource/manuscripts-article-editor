import * as React from 'react'

import { storiesOf } from '@storybook/react'

import Spinner from '../src/icons/spinner'

storiesOf('Spinner', module)
  .add('default', () => <Spinner />)
  .add('color', () => <Spinner color={'red'} />)
  .add('size', () => <Spinner size={200} />)
