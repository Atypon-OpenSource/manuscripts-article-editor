import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Footer } from '../src/components/Footer'

const links = [
  {
    url: 'https://example.com/support',
    text: 'Support',
  },
  {
    url: 'https://example.com/feedback',
    text: 'Feedback',
  },
]

storiesOf('Footer', module).add('default', () => <Footer links={links} />)
