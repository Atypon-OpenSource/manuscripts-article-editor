import { storiesOf } from '@storybook/react'
import React from 'react'
import AlertMessage from '../src/components/AlertMessage'

storiesOf('AlertMessage', module)
  .add('success', () => (
    <AlertMessage type={'success'}>
      Example of overall success message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('error', () => (
    <AlertMessage type={'error'}>
      Example of overall error message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('info', () => (
    <AlertMessage type={'info'}>
      Example of overall info message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
  .add('warning', () => (
    <AlertMessage type={'warning'}>
      Example of overall warning message. Lorem ipsum dolor sit amet.
    </AlertMessage>
  ))
