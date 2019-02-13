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
import { Main, Page } from '../src/components/Page'
import { project } from './data/projects'

storiesOf('Page', module)
  .add('A page', () => (
    <Page>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
  .add('A page with a project', () => (
    <Page project={project}>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
