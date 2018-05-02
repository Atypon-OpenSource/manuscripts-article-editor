import { storiesOf } from '@storybook/react'
import React from 'react'
import { AuthorDetails } from '../src/components/AuthorDetails'
import { Authors } from '../src/components/Authors'
import authors from './data/people'

const author = authors[0]

storiesOf('Authors', module)
  .add('Authors', () => <Authors authors={authors} />)
  .add('Author Details', () => <AuthorDetails author={author} />)
