import { storiesOf } from '@storybook/react'
import React from 'react'
import Spinner from '../src/icons/spinner'

storiesOf('Spinner', module)
  .add('default', () => <Spinner />)
  .add('color', () => <Spinner color={'red'} />)
  .add('size', () => <Spinner size={200} />)
