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

import {
  ActualManuscriptNode,
  ContainedModel,
  ManuscriptEditorView,
  SectionNode,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  CommentAnnotation,
  Keyword,
  Manuscript,
  ManuscriptNote,
  Project,
  Section,
  Submission,
  Tag,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  InspectorSection,
  ManuscriptNoteList,
  usePermissions,
} from '@manuscripts/style-guide'
import { Transaction } from 'prosemirror-state'
import { ContentNodeWithPos } from 'prosemirror-utils'
import React, { useEffect, useState } from 'react'

import config from '../../config'
import { useSharedData } from '../../hooks/use-shared-data'
import { canWrite } from '../../lib/roles'
import { getCurrentUserId } from '../../lib/user'
import { useStore } from '../../store'
import {
  InspectorContainer,
  InspectorTab,
  InspectorTabList,
  InspectorTabPanel,
  InspectorTabs,
  PaddedInspectorTabPanels,
} from '../Inspector'
import {
  AnyElement,
  ElementStyleInspector,
} from '../inspector/ElementStyleInspector'
import { HistoryPanelContainer } from '../inspector/History'
import { InlineStyleInspector } from '../inspector/InlineStyleInspector'
import { ManageTargetInspector } from '../inspector/ManageTargetInspector'
import { ManuscriptStyleInspector } from '../inspector/ManuscriptStyleInspector'
import { NodeInspector } from '../inspector/NodeInspector'
import { SectionInspector } from '../inspector/SectionInspector'
import { SectionStyleInspector } from '../inspector/SectionStyleInspector'
import { StatisticsInspector } from '../inspector/StatisticsInspector'
import { SubmissionsInspector } from '../inspector/SubmissionsInspector'
import { RequirementsInspector } from '../requirements/RequirementsInspector'
import { CommentList } from './CommentList'
import { CommentFilter } from './CommentListPatterns'
import { HeaderImageInspector } from './HeaderImageInspector'
import { ManuscriptInspector, SaveModel } from './ManuscriptInspector'

const TABS = [
  'Content',
  'Style',
  (config.features.commenting || config.features.productionNotes) && 'Comments',
  config.features.qualityControl && 'Quality',
  config.shackles.enabled && 'History',
  config.export.to_review && 'Submissions',
].filter(Boolean) as Array<
  'Content' | 'Style' | 'Comments' | 'Quality' | 'History' | 'Submissions'
>

export const Inspector: React.FC<{
  bundle?: Bundle
  comments?: CommentAnnotation[]
  commentTarget?: string
  createKeyword: (name: string) => Promise<Keyword>
  dispatchNodeAttrs: (
    id: string,
    attrs: Record<string, unknown>,
    nodispatch?: boolean
  ) => Transaction | undefined
  dispatchUpdate: () => void
  doc: ActualManuscriptNode
  element?: AnyElement
  getCollaborator: (id: string) => UserProfile | undefined
  getCollaboratorById: (id: string) => UserProfile | undefined
  getCurrentUser: () => UserProfile
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  notes?: ManuscriptNote[]
  noteTarget?: string
  openCitationStyleSelector: () => void
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  project: Project
  saveModel: SaveModel
  section?: Section
  selected: ContentNodeWithPos | null
  selectedSection?: ContentNodeWithPos
  setCommentTarget: () => void
  submission?: Submission
  view: ManuscriptEditorView
  tags: Tag[]
  manageManuscript: boolean
  bulkUpdate: (items: Array<ContainedModel>) => Promise<void>
  openTemplateSelector: (newProject: boolean, switchTemplate?: boolean) => void
}> = ({
  bundle,
  comments,
  commentTarget,
  createKeyword,
  dispatchNodeAttrs,
  dispatchUpdate,
  doc,
  element,
  getCollaborator,
  getCollaboratorById,
  getCurrentUser,
  getKeyword,
  listCollaborators,
  listKeywords,
  notes,
  openCitationStyleSelector,
  section,
  selected,
  selectedSection,
  setCommentTarget,
  submission,
  view,
  manageManuscript,
  openTemplateSelector,
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [commentFilter, setCommentFilter] = useState<CommentFilter>(
    CommentFilter.UNRESOLVED
  )

  const [modelMap] = useStore((s) => s.modelMap)
  const [manuscript] = useStore((s) => s.manuscript)
  const [project] = useStore((s) => s.project)
  const [saveModel] = useStore((s) => s.saveModel)
  const [deleteModel] = useStore((s) => s.deleteModel)

  const {
    getTemplate,
    getManuscriptCountRequirements,
    getSectionCountRequirements,
  } = useSharedData()

  useEffect(() => {
    if (commentTarget) {
      setTabIndex(TABS.findIndex((tab) => tab === 'Comments'))
    } else if (submission) {
      setTabIndex(TABS.findIndex((tab) => tab === 'Submissions'))
    }
  }, [commentTarget, submission])

  const can = usePermissions()

  return (
    <InspectorContainer>
      <InspectorTabs index={tabIndex} onChange={setTabIndex}>
        <InspectorTabList>
          {TABS.map((label, i) => (
            <InspectorTab key={i}>{label}</InspectorTab>
          ))}
        </InspectorTabList>
        <PaddedInspectorTabPanels>
          {TABS.map((label) => {
            if (label !== TABS[tabIndex]) {
              return <InspectorTabPanel key={label}></InspectorTabPanel>
            }

            switch (label) {
              case 'Content': {
                return (
                  <InspectorTabPanel key={label}>
                    <StatisticsInspector
                      manuscriptNode={doc}
                      sectionNode={
                        selectedSection
                          ? (selectedSection.node as SectionNode)
                          : undefined
                      }
                    />
                    {config.features.headerImage && <HeaderImageInspector />}
                    {config.features.nodeInspector && selected && (
                      <NodeInspector
                        selected={selected}
                        state={view.state}
                        dispatch={view.dispatch}
                      />
                    )}
                    <ManuscriptInspector
                      key={manuscript._id}
                      state={view.state}
                      dispatch={view.dispatch}
                      openTemplateSelector={openTemplateSelector}
                      getTemplate={getTemplate}
                      getManuscriptCountRequirements={
                        getManuscriptCountRequirements
                      }
                      canWrite={canWrite(project, getCurrentUserId()!)}
                      leanWorkflow={false}
                    />

                    {(element || section) &&
                      config.features.projectManagement && (
                        <ManageTargetInspector
                          target={
                            manageManuscript
                              ? manuscript
                              : ((element || section) as AnyElement | Section)
                          }
                        />
                      )}

                    {section && (
                      <SectionInspector
                        key={section._id}
                        section={section}
                        state={view.state}
                        dispatch={view.dispatch}
                        sectionNode={
                          selectedSection
                            ? (selectedSection.node as SectionNode)
                            : undefined
                        }
                        dispatchNodeAttrs={dispatchNodeAttrs}
                        getSectionCountRequirements={
                          getSectionCountRequirements
                        }
                      />
                    )}
                  </InspectorTabPanel>
                )
              }

              case 'Style': {
                return (
                  <InspectorTabPanel key={label}>
                    <ManuscriptStyleInspector
                      bundle={bundle}
                      openCitationStyleSelector={openCitationStyleSelector}
                    />
                    {element && (
                      <ElementStyleInspector
                        manuscript={manuscript}
                        element={element}
                        modelMap={modelMap}
                        saveModel={saveModel}
                        deleteModel={deleteModel}
                        view={view}
                      />
                    )}
                    {section && (
                      <SectionStyleInspector
                        section={section}
                        modelMap={modelMap}
                        saveModel={saveModel}
                        dispatchUpdate={dispatchUpdate}
                      />
                    )}
                    <InlineStyleInspector
                      modelMap={modelMap}
                      saveModel={saveModel}
                      deleteModel={deleteModel}
                      view={view}
                    />
                  </InspectorTabPanel>
                )
              }

              case 'Comments': {
                return (
                  <InspectorTabPanel key={label} style={{ marginTop: '16px' }}>
                    {config.features.commenting && (
                      <InspectorSection
                        title={'Comments'}
                        contentStyles={{ margin: '0 25px 24px 0' }}
                      >
                        <CommentList
                          comments={comments || []}
                          doc={doc}
                          getCurrentUser={getCurrentUser}
                          selected={selected}
                          createKeyword={createKeyword}
                          deleteModel={deleteModel}
                          getCollaborator={getCollaborator}
                          getCollaboratorById={getCollaboratorById}
                          getKeyword={getKeyword}
                          listCollaborators={listCollaborators}
                          listKeywords={listKeywords}
                          saveModel={saveModel}
                          commentTarget={commentTarget}
                          setCommentTarget={setCommentTarget}
                          state={view.state}
                          dispatch={view.dispatch}
                          key={commentTarget}
                          setCommentFilter={setCommentFilter}
                          commentFilter={commentFilter}
                        />
                      </InspectorSection>
                    )}
                    {config.features.productionNotes && (
                      <InspectorSection
                        title={'Notes'}
                        contentStyles={{ margin: '0 25px 24px 0' }}
                      >
                        <ManuscriptNoteList
                          createKeyword={createKeyword}
                          notes={notes || []}
                          currentUserId={getCurrentUser()._id}
                          getKeyword={getKeyword}
                          can={can}
                          listKeywords={listKeywords}
                          selected={selected}
                          getCollaboratorById={getCollaboratorById}
                          listCollaborators={listCollaborators}
                          saveModel={saveModel}
                          deleteModel={deleteModel}
                          noteSource={'EDITOR'}
                        />
                      </InspectorSection>
                    )}
                  </InspectorTabPanel>
                )
              }

              case 'Quality': {
                return (
                  <InspectorTabPanel key="Quality">
                    <RequirementsInspector />
                  </InspectorTabPanel>
                )
              }

              case 'History': {
                return (
                  <InspectorTabPanel key="History">
                    <HistoryPanelContainer
                      project={project}
                      manuscriptID={manuscript._id}
                      getCurrentUser={getCurrentUser}
                    />
                  </InspectorTabPanel>
                )
              }

              case 'Submissions': {
                return (
                  <InspectorTabPanel key="Submissions">
                    <SubmissionsInspector modelMap={modelMap} />
                  </InspectorTabPanel>
                )
              }
              default: {
                return null
              }
            }
          })}
        </PaddedInspectorTabPanels>
      </InspectorTabs>
    </InspectorContainer>
  )
}
