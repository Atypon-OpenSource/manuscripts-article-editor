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
import Panel from '../src/components/Panel'

storiesOf('Panel', module)
  .add('row', () => (
    <Page>
      <Panel name={'testStart'} minSize={200} direction={'row'} side={'end'}>
        <p style={{ paddingRight: 20 }}>This is a panel at the start</p>
      </Panel>
      <Main>
        <p style={{ paddingLeft: 20 }}>This is the main content.</p>
      </Main>
      <Panel name={'testEnd'} minSize={200} direction={'row'} side={'start'}>
        <p style={{ paddingLeft: 20 }}>This is a panel at the end</p>
      </Panel>
    </Page>
  ))
  .add('combined', () => (
    <Page>
      <Panel name={'testStart'} minSize={200} direction={'row'} side={'end'}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel
            name={'testColumn'}
            minSize={200}
            direction={'column'}
            side={'end'}
          >
            <p>This is a panel</p>
          </Panel>
          <div style={{ paddingTop: 20 }}>This is another section</div>
        </div>
      </Panel>

      <Main>
        <p style={{ paddingLeft: 20 }}>This is the main content.</p>
      </Main>
    </Page>
  ))
