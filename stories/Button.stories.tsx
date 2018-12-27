import { action } from '@storybook/addon-actions'
import { withNotes } from '@storybook/addon-notes'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  Button,
  IconButton,
  ManuscriptBlueButton,
  PrimaryButton,
  TransparentBlackButton,
  TransparentGreyButton,
} from '../src/components/Button'
import GoogleIcon from '../src/icons/google'

storiesOf('Buttons', module)
  .add('Button', () => <Button onClick={action('clicked')}>Make</Button>)
  .add('Primary Button', () => (
    <PrimaryButton onClick={action('clicked')}>Done</PrimaryButton>
  ))
  .add('Manuscripts Blue Button', () => (
    <ManuscriptBlueButton onClick={action('clicked')}>
      Save
    </ManuscriptBlueButton>
  ))
  .add('Transperent Grey Button', () => (
    <TransparentGreyButton onClick={action('clicked')}>
      Cancel
    </TransparentGreyButton>
  ))
  .add('Transperent Black Button', () => (
    <TransparentBlackButton onClick={action('clicked')}>
      Cancel
    </TransparentBlackButton>
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
