import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Footer } from '../src/components/Footer'

import links from './data/links'

storiesOf('Footer', module).add('default', () => <Footer links={links} />)
