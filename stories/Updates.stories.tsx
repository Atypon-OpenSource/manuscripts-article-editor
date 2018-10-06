import { storiesOf } from '@storybook/react'
import React from 'react'
import { Updates } from '../src/components/Updates'
import { feed } from './data/updates'

storiesOf('Updates', module)
  .add('Loading', () => (
    <Updates
      host={'https://example.com'}
      posts={null}
      topics={null}
      error={null}
      loaded={false}
    />
  ))
  .add('Error', () => (
    <Updates
      host={'https://example.com'}
      posts={null}
      topics={null}
      error={'There was an error'}
      loaded={false}
    />
  ))
  .add('Loaded', () => (
    <Updates
      host={'https://example.com'}
      posts={feed.posts}
      topics={feed.topics}
      error={null}
      loaded={true}
    />
  ))
