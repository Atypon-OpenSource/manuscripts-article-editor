import { action } from '@storybook/addon-actions'
import { withNotes } from '@storybook/addon-notes'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  Button,
  DangerButton,
  GreyButton,
  IconButton,
  MiniButton,
  PrimaryButton,
  PrimaryMiniButton,
} from '../src/components/Button'
import GoogleIcon from '../src/icons/google'

storiesOf('Buttons', module)
  .add('Button', () => <Button onClick={action('clicked')}>Make</Button>)
  .add('Primary Button', () => (
    <PrimaryButton onClick={action('clicked')}>Done</PrimaryButton>
  ))
  .add('Danger Button', () => (
    <DangerButton onClick={action('clicked')}>Delete</DangerButton>
  ))
  .add('Grey Button', () => (
    <GreyButton onClick={action('clicked')}>Example</GreyButton>
  ))
  .add('Mini Button', () => (
    <MiniButton onClick={action('clicked')}>Click</MiniButton>
  ))
  .add('Primary Mini Button', () => (
    <PrimaryMiniButton onClick={action('clicked')}>Click</PrimaryMiniButton>
  ))
  .add(
    'Icon Button',
    withNotes('This icon would usually be used in an AuthenticationButton.')(
      () => (
        <IconButton onClick={action('clicked')}>
          <GoogleIcon />
        </IconButton>
      )
    )
  )
