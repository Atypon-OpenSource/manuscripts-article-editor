import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Hero, SubHero } from '../src/components/Hero'

storiesOf('Hero', module)
  .add('Hero', () => <Hero>Welcome</Hero>)
  .add('SubHero', () => <SubHero>Welcome</SubHero>)
