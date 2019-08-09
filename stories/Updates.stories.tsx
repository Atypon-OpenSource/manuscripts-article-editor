/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { storiesOf } from '@storybook/react'
import React from 'react'
import { Updates } from '../src/components/nav/Updates'
import { feed } from './data/updates'

storiesOf('Updates', module)
  .add('Loading', () => <Updates host={'https://example.com'} loaded={false} />)
  .add('Error', () => (
    <Updates
      host={'https://example.com'}
      error={'There was an error'}
      loaded={false}
    />
  ))
  .add('Loaded', () => (
    <Updates
      host={'https://example.com'}
      posts={feed.posts}
      topics={feed.topics}
      loaded={true}
    />
  ))
