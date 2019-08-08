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

import aphorisms from '@manuscripts/data/dist/shared/aphorisms.json'
import { storiesOf } from '@storybook/react'
import { sample } from 'lodash-es'
import React from 'react'
import {
  ManuscriptPlaceholder,
  ProjectPlaceholder,
} from '../src/components/Placeholders'

storiesOf('Placeholders', module)
  .add('Manuscript', () => <ManuscriptPlaceholder />)
  .add('Manuscript with aphorism', () => (
    <ManuscriptPlaceholder aphorism={sample(aphorisms)} />
  ))
  .add('Project', () => <ProjectPlaceholder />)
  .add('Project with aphorism', () => (
    <ProjectPlaceholder aphorism={sample(aphorisms)} />
  ))
