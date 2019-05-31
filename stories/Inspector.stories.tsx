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

import data from '@manuscripts/examples/data/project-dump.json'
import { Manuscript, Section } from '@manuscripts/manuscripts-json-schema'
import { TabPanel, TabPanels, Tabs } from '@reach/tabs'
import '@reach/tabs/styles.css'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InspectorTab, InspectorTabList } from '../src/components/Inspector'
import { ManuscriptInspector } from '../src/components/projects/ManuscriptInspector'
import { SectionInspector } from '../src/components/projects/SectionInspector'
import { buildModelMap } from '../src/pressroom/__tests__/util'
import { ProjectDump } from '../src/pressroom/importers'

const manuscript: Manuscript = {
  _id: 'MPManuscript:1',
  containerID: 'MPProject:1',
  objectType: 'MPManuscript',
  createdAt: 0,
  updatedAt: 0,
}

const section: Section = {
  _id: 'MPSection:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPSection',
  createdAt: 0,
  updatedAt: 0,
  sessionID: '1',
  priority: 1,
  path: ['MPSection:1'],
}

const modelMap = buildModelMap(data as ProjectDump)

storiesOf('Inspector', module).add('tabs', () => (
  <div style={{ width: 500 }}>
    <Tabs>
      <InspectorTabList>
        <InspectorTab>Tab 1</InspectorTab>
        <InspectorTab>Tab 2</InspectorTab>
        <InspectorTab>Tab 3</InspectorTab>
      </InspectorTabList>

      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
      </TabPanels>
    </Tabs>
  </div>
))

storiesOf('Inspector/Manuscript Inspector', module).add(
  'without requirements',
  () => (
    <div style={{ width: 500 }}>
      <ManuscriptInspector
        modelMap={modelMap}
        manuscript={manuscript}
        saveModel={action('save')}
      />
    </div>
  )
)

storiesOf('Inspector/Section Inspector', module).add(
  'without requirements',
  () => (
    <div style={{ width: 500 }}>
      <SectionInspector
        modelMap={modelMap}
        section={section}
        saveModel={action('save')}
      />
    </div>
  )
)
