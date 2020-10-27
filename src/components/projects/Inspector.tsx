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
  ManuscriptEditorView,
  SectionNode,
  Selected,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  CommentAnnotation,
  Keyword,
  Manuscript,
  Model,
  Project,
  Section,
  Submission,
  Tag,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'

import config from '../../config'
import { useStatusLabels } from '../../hooks/use-status-labels'
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
import { HeaderImageInspector } from './HeaderImageInspector'
import { ManuscriptInspector, SaveModel } from './ManuscriptInspector'

export const Inspector: React.FC<{
  bundle?: Bundle
  comments?: CommentAnnotation[]
  commentTarget?: string
  createKeyword: (name: string) => Promise<Keyword>
  deleteModel: (id: string) => Promise<string>
  dispatchNodeAttrs: (id: string, attrs: Record<string, unknown>) => void
  dispatchUpdate: () => void
  doc: ActualManuscriptNode
  element?: AnyElement
  getCollaborator: (id: string) => UserProfile | undefined
  getCollaboratorById: (id: string) => UserProfile | undefined
  getCurrentUser: () => UserProfile
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  manuscript: Manuscript
  modelMap: Map<string, Model>
  openCitationStyleSelector: () => void
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  project: Project
  saveModel: SaveModel
  section?: Section
  selected: Selected | null
  selectedSection?: Selected
  setCommentTarget: () => void
  submission?: Submission
  view: ManuscriptEditorView
  tags: Tag[]
  manageManuscript: boolean
}> = ({
  bundle,
  comments,
  commentTarget,
  createKeyword,
  deleteModel,
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
  manuscript,
  modelMap,
  openCitationStyleSelector,
  saveManuscript,
  project,
  saveModel,
  section,
  selected,
  selectedSection,
  setCommentTarget,
  submission,
  view,
  tags,
  manageManuscript,
}) => {
  const [tabIndex, setTabIndex] = useState(0)

  const statusLabels = useStatusLabels(manuscript.containerID, manuscript._id)

  useEffect(() => {
    if (commentTarget) {
      setTabIndex(2)
    } else if (submission) {
      setTabIndex(3)
    }
  }, [commentTarget, submission])

  return (
    <InspectorContainer>
      <InspectorTabs index={tabIndex} onChange={setTabIndex}>
        <InspectorTabList>
          <InspectorTab>Content</InspectorTab>
          <InspectorTab>Style</InspectorTab>
          <InspectorTab>Comments</InspectorTab>
          {config.quality_control.enabled && (
            <InspectorTab>Quality Report</InspectorTab>
          )}
          {config.shackles.enabled && <InspectorTab>History</InspectorTab>}
          {config.export.to_review && <InspectorTab>Submissions</InspectorTab>}
        </InspectorTabList>

        <PaddedInspectorTabPanels>
          <InspectorTabPanel>
            {tabIndex === 0 && (
              <>
                <StatisticsInspector
                  manuscriptNode={doc}
                  sectionNode={
                    selectedSection
                      ? (selectedSection.node as SectionNode)
                      : undefined
                  }
                />
                {config.export.literatum && (
                  <HeaderImageInspector
                    deleteModel={deleteModel}
                    manuscript={manuscript}
                    modelMap={modelMap}
                    saveManuscript={saveManuscript}
                    saveModel={saveModel}
                  />
                )}
                {config.export.literatum && selected && (
                  <NodeInspector
                    manuscript={manuscript}
                    selected={selected}
                    modelMap={modelMap}
                    saveModel={saveModel}
                    deleteModel={deleteModel}
                    view={view}
                  />
                )}
                <ManuscriptInspector
                  key={manuscript._id}
                  manuscript={manuscript}
                  modelMap={modelMap}
                  saveManuscript={saveManuscript}
                  saveModel={saveModel}
                  view={view}
                />

                {(element || section) && config.features.projectManagement && (
                  <ManageTargetInspector
                    target={
                      manageManuscript
                        ? manuscript
                        : ((element || section) as AnyElement | Section)
                    }
                    listCollaborators={listCollaborators}
                    saveModel={saveModel}
                    statusLabels={statusLabels}
                    tags={tags}
                    modelMap={modelMap}
                    deleteModel={deleteModel}
                    project={project}
                  />
                )}

                {section && (
                  <SectionInspector
                    key={section._id}
                    section={section}
                    sectionNode={
                      selectedSection
                        ? (selectedSection.node as SectionNode)
                        : undefined
                    }
                    modelMap={modelMap}
                    saveModel={saveModel}
                    dispatchNodeAttrs={dispatchNodeAttrs}
                  />
                )}
              </>
            )}
          </InspectorTabPanel>

          <InspectorTabPanel>
            {tabIndex === 1 && (
              <>
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
              </>
            )}
          </InspectorTabPanel>

          <InspectorTabPanel>
            {tabIndex === 2 && (
              <>
                {comments && (
                  <CommentList
                    comments={comments}
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
                    view={view}
                    key={commentTarget}
                  />
                )}
              </>
            )}
          </InspectorTabPanel>

          {config.quality_control.enabled && (
            <InspectorTabPanel>
              {tabIndex === 3 && (
                <>
                  <RequirementsInspector
                    modelMap={modelMap}
                    prototypeId={manuscript.prototype}
                    manuscriptID={manuscript._id}
                  />
                </>
              )}
            </InspectorTabPanel>
          )}

          {config.shackles.enabled && (
            <InspectorTabPanel>
              {tabIndex === 4 && (
                <HistoryPanelContainer
                  project={project}
                  manuscriptID={manuscript._id}
                  getCurrentUser={getCurrentUser}
                />
              )}
            </InspectorTabPanel>
          )}

          {config.export.to_review && (
            <InspectorTabPanel>
              {tabIndex === 5 && (
                <>
                  <SubmissionsInspector modelMap={modelMap} />
                </>
              )}
            </InspectorTabPanel>
          )}
        </PaddedInspectorTabPanels>
      </InspectorTabs>
    </InspectorContainer>
  )
}
