/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import '@reach/tabs/styles.css'

import data from '@manuscripts/examples/data/project-dump.json'
import {
  ActualManuscriptNode,
  ManuscriptEditorState,
  SectionNode,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Manuscript,
  ParagraphStyle,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import { TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { InspectorTab, InspectorTabList } from '../src/components/Inspector'
import { HistoryPanel } from '../src/components/inspector/History'
import { ManageTargetInspector } from '../src/components/inspector/ManageTargetInspector'
import { ManuscriptStyleInspector } from '../src/components/inspector/ManuscriptStyleInspector'
import { ParagraphStyles } from '../src/components/inspector/ParagraphStyles'
import { SectionInspector } from '../src/components/inspector/SectionInspector'
import { SectionStyles } from '../src/components/inspector/SectionStyles'
import { StatisticsInspector } from '../src/components/inspector/StatisticsInspector'
import { ManuscriptInspector } from '../src/components/projects/ManuscriptInspector'
import { SaveSnapshotStatus } from '../src/hooks/use-snapshot-manager'
import { buildColors } from '../src/lib/colors'
import { findBodyTextParagraphStyles } from '../src/lib/styles'
import { buildModelMap } from '../src/pressroom/__tests__/util'
import { ProjectDump } from '../src/pressroom/importers'
import { doc } from './data/doc'
import { people } from './data/people'
import { project } from './data/projects'
import { snapshots } from './data/snapshots'
import { statusLabels } from './data/status-labels'
import { tags } from './data/tags'

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
  title:
    'Acetic acid activates distinct taste pathways in <i>Drosophila</i> to elicit opposing, state-dependent feeding responses',
  createdAt: 0,
  updatedAt: 0,
  sessionID: '1',
  priority: 1,
  path: ['MPSection:1'],
}

const bundle: Bundle = {
  _id: 'MPBundle:1',
  containerID: 'MPProject:1',
  objectType: 'MPBundle',
  csl: {
    title: 'Nature',
  },
  createdAt: 0,
  updatedAt: 0,
}

const modelMap = buildModelMap(data as ProjectDump)
const { colors, colorScheme } = buildColors(modelMap)
const bodyTextParagraphStyles = findBodyTextParagraphStyles(modelMap)

const defaultParagraphStyle = bodyTextParagraphStyles.find(
  (style) => style.kind === 'body'
) as ParagraphStyle

const state = {}

const view = {
  dispatch: action('dispatch'),
  state: state as ManuscriptEditorState,
}

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
        saveManuscript={action('save manuscript')}
        saveModel={action('save')}
        state={view.state}
        dispatch={view.dispatch}
        openTemplateSelector={action('open template selector ')}
        getTemplate={action('get the template')}
        getManuscriptCountRequirements={action(
          'get the manuscript count requirements'
        )}
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
        dispatchNodeAttrs={action('dispatch node attributes')}
        getSectionCountRequirements={action(
          'get the section count requirements'
        )}
      />
    </div>
  )
)

storiesOf('Inspector/Manuscript Style Inspector', module)
  .add('without bundle', () => (
    <div style={{ width: 500 }}>
      <ManuscriptStyleInspector
        bundle={undefined}
        openCitationStyleSelector={action('open citation style inspector')}
      />
    </div>
  ))
  .add('with bundle', () => (
    <div style={{ width: 500 }}>
      <ManuscriptStyleInspector
        bundle={bundle}
        openCitationStyleSelector={action('open citation style inspector')}
      />
    </div>
  ))

const manuscriptNode = doc as ActualManuscriptNode
const sectionNode = doc.child(0) as SectionNode

storiesOf('Inspector/Statistics Inspector', module)
  .add('without section', () => (
    <div style={{ width: 500 }}>
      <StatisticsInspector manuscriptNode={manuscriptNode} />
    </div>
  ))
  .add('with section', () => (
    <div style={{ width: 500 }}>
      <StatisticsInspector
        manuscriptNode={manuscriptNode}
        sectionNode={sectionNode}
      />
    </div>
  ))

storiesOf('Inspector/Paragraph Styles', module).add('with bundle', () => (
  <div style={{ width: 500 }}>
    <ParagraphStyles
      bodyTextParagraphStyles={bodyTextParagraphStyles}
      colors={colors}
      colorScheme={colorScheme}
      defaultParagraphStyle={defaultParagraphStyle}
      deleteParagraphStyle={action('delete paragraph style')}
      duplicateParagraphStyle={action('duplicate paragraph style')}
      error={undefined}
      paragraphStyle={defaultParagraphStyle}
      renameParagraphStyle={action('rename paragraph style')}
      saveDebouncedParagraphStyle={action('save debounced paragraph style')}
      saveModel={action('save model')}
      saveParagraphStyle={action('save paragraph style')}
      setElementParagraphStyle={action('set element paragraph style')}
      setError={action('set error')}
    />
  </div>
))

storiesOf('Inspector/Section Styles', module).add('with bundle', () => (
  <div style={{ width: 500 }}>
    <SectionStyles
      colors={colors}
      colorScheme={colorScheme}
      error={undefined}
      paragraphStyle={defaultParagraphStyle}
      saveDebouncedParagraphStyle={action('save debounced paragraph style')}
      saveModel={action('save model')}
      saveParagraphStyle={action('save paragraph style')}
      setError={action('set error')}
      title={'Section Heading Styles'}
    />
  </div>
))

storiesOf('Inspector/History', module).add('basic', () => (
  <HistoryPanel
    project={project}
    manuscriptID="MANUSCRIPT"
    snapshotsList={snapshots}
    isCreateFormOpen={true}
    requestTakeSnapshot={action('take snapshot')}
    submitName={action('take current name and finalize snapshot')}
    textFieldValue=""
    handleTextFieldChange={action('update text field value')}
    currentUserId={people[0]._id}
  />
))

storiesOf('Inspector/History', module).add('while saving', () => (
  <HistoryPanel
    project={project}
    manuscriptID="MANUSCRIPT"
    snapshotsList={snapshots}
    isCreateFormOpen={true}
    requestTakeSnapshot={action('take snapshot')}
    submitName={action('take current name and finalize snapshot')}
    textFieldValue=""
    handleTextFieldChange={action('update text field value')}
    status={SaveSnapshotStatus.Submitting}
    currentUserId={people[0]._id}
  />
))

storiesOf('Inspector/History', module).add('error while saving', () => (
  <HistoryPanel
    project={project}
    manuscriptID="MANUSCRIPT"
    snapshotsList={snapshots}
    isCreateFormOpen={true}
    requestTakeSnapshot={action('take snapshot')}
    submitName={action('take current name and finalize snapshot')}
    textFieldValue=""
    handleTextFieldChange={action('update text field value')}
    status={SaveSnapshotStatus.Error}
    currentUserId={people[0]._id}
  />
))

storiesOf('Inspector/History', module).add('read only', () => (
  <HistoryPanel
    project={project}
    manuscriptID="MANUSCRIPT"
    snapshotsList={snapshots}
    currentUserId={people[0]._id}
  />
))

storiesOf('Inspector', module).add('Manage Section', () => (
  <ManageTargetInspector
    target={{
      ...section,
      assignees: ['user-1'],
      deadline: 1593982800,
      keywordIDs: ['tag-1', 'tag-2'],
    }}
    saveModel={action('save')}
    listCollaborators={() => people}
    statusLabels={statusLabels}
    tags={tags}
    modelMap={modelMap}
    deleteModel={action('delete')}
    project={project}
  />
))
