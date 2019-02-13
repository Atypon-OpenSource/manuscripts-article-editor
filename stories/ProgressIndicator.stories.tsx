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
import {
  IndicatorKind,
  IndicatorSize,
  ProgressIndicator,
} from '../src/components/ProgressIndicator'

storiesOf('Progress Indicator', module)
  .add('Determinate', () => (
    <div>
      <ProgressIndicator
        isDeterminate={true}
        progress={0.1}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Author}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.3}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ContributorDetail}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.5}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Contributors}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.7}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Project}
      />
      <ProgressIndicator
        isDeterminate={true}
        progress={0.9}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ReferenceLibrary}
      />
    </div>
  ))
  .add('Indeterminate', () => (
    <div>
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Author}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ContributorDetail}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Contributors}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.Project}
      />
      <ProgressIndicator
        isDeterminate={false}
        size={IndicatorSize.Large}
        symbols={IndicatorKind.ReferenceLibrary}
      />
    </div>
  ))
