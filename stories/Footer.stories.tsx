import { storiesOf } from '@storybook/react'
import React from 'react'
import { Footer } from '../src/components/Footer'

const links = [
  {
    url: 'https://example.com/support',
    text: 'Support',
  },
  {
    url: 'mailto:support@example.com',
    text: 'Feedback',
  },
]

storiesOf('Footer', module).add('default', () => <Footer links={links} />)
