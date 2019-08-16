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
  CommentAnnotation,
  ManuscriptEditorView,
  SectionNode,
  Selected,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Keyword,
  Manuscript,
  Model,
  Section,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'
import {
  InspectorContainer,
  InspectorTab,
  InspectorTabList,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import {
  AnyElement,
  ElementStyleInspector,
} from '../inspector/ElementStyleInspector'
import { ManuscriptStyleInspector } from '../inspector/ManuscriptStyleInspector'
import { SectionInspector } from '../inspector/SectionInspector'
import { SectionStyleInspector } from '../inspector/SectionStyleInspector'
import { StatisticsInspector } from '../inspector/StatisticsInspector'
import { CommentList } from './CommentList'
import { ManuscriptInspector, SaveModel } from './ManuscriptInspector'

export const Inspector: React.FC<{
  bundle?: Bundle
  comments: CommentAnnotation[]
  commentTarget?: string
  createKeyword: (name: string) => Promise<Keyword>
  deleteModel: (id: string) => Promise<string>
  dispatchNodeAttrs: (id: string, attrs: object) => void
  doc: ActualManuscriptNode
  element?: AnyElement
  getCollaborator: (id: string) => UserProfile | undefined
  getCurrentUser: () => UserProfile
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  manuscript: Manuscript
  modelMap: Map<string, Model>
  openCitationStyleSelector: () => void
  saveModel: SaveModel
  section?: Section
  selected: Selected | null
  selectedSection?: Selected
  setCommentTarget: () => void
  view?: ManuscriptEditorView
}> = ({
  bundle,
  comments,
  commentTarget,
  createKeyword,
  deleteModel,
  dispatchNodeAttrs,
  doc,
  element,
  getCollaborator,
  getCurrentUser,
  getKeyword,
  listCollaborators,
  listKeywords,
  manuscript,
  modelMap,
  openCitationStyleSelector,
  saveModel,
  section,
  selected,
  selectedSection,
  setCommentTarget,
  view,
}) => {
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (commentTarget) {
      setTabIndex(2)
    }
  }, [commentTarget])

  return (
    <InspectorContainer>
      <InspectorTabs index={tabIndex} onChange={setTabIndex}>
        <InspectorTabList>
          <InspectorTab>Content</InspectorTab>
          <InspectorTab>Style</InspectorTab>
          <InspectorTab>Comments</InspectorTab>
        </InspectorTabList>

        <InspectorTabPanels>
          <InspectorTabPanel>
            <StatisticsInspector
              manuscriptNode={doc}
              sectionNode={
                selectedSection
                  ? (selectedSection.node as SectionNode)
                  : undefined
              }
            />
            <ManuscriptInspector
              manuscript={manuscript}
              modelMap={modelMap}
              saveModel={saveModel}
            />
            {section && view && (
              <SectionInspector
                section={section}
                modelMap={modelMap}
                saveModel={saveModel}
                dispatchNodeAttrs={dispatchNodeAttrs}
              />
            )}
          </InspectorTabPanel>
          <InspectorTabPanel>
            <ManuscriptStyleInspector
              bundle={bundle}
              openCitationStyleSelector={openCitationStyleSelector}
            />
            {element && view && (
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
                manuscript={manuscript}
                section={section}
                modelMap={modelMap}
                saveModel={saveModel}
              />
            )}
          </InspectorTabPanel>
          <InspectorTabPanel>
            <CommentList
              comments={comments}
              doc={doc}
              getCurrentUser={getCurrentUser}
              selected={selected}
              createKeyword={createKeyword}
              deleteModel={deleteModel}
              getCollaborator={getCollaborator}
              getKeyword={getKeyword}
              listCollaborators={listCollaborators}
              listKeywords={listKeywords}
              saveModel={saveModel}
              commentTarget={commentTarget}
              setCommentTarget={setCommentTarget}
            />
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorContainer>
  )
}
