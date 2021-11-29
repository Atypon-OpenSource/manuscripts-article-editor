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
  ManuscriptNode,
  SectionNode,
  Selected,
} from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Model,
  Project,
  Section,
  Tag,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'

import config from '../../../config'
import { useSharedData } from '../../../hooks/use-shared-data'
import { useStatusLabels } from '../../../hooks/use-status-labels'
import { AnyElement } from '../../inspector/ElementStyleInspector'
import { ManageTargetInspector } from '../../inspector/ManageTargetInspector'
import { NodeInspector } from '../../inspector/NodeInspector'
import { SectionInspector } from '../../inspector/SectionInspector'
import { StatisticsInspector } from '../../inspector/StatisticsInspector'
import { HeaderImageInspector } from '../HeaderImageInspector'
import { ManuscriptInspector, SaveModel } from '../ManuscriptInspector'

export const ContentTab: React.FC<{
  selected?: Selected
  selectedElement?: Selected
  selectedSection?: Selected
  getModel: <T extends Model>(id: string) => T | undefined
  modelMap: Map<string, Model>
  manuscript: Manuscript
  state: EditorState
  dispatch: (tr: Transaction) => EditorState
  hasFocus?: boolean
  doc: ManuscriptNode
  saveModel: SaveModel
  deleteModel: (id: string) => Promise<string>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  listCollaborators: () => UserProfile[]
  project: Project
  tags: Tag[]
  openTemplateSelector: (newProject: boolean, switchTemplate: boolean) => void
}> = ({
  selected,
  selectedSection,
  selectedElement,
  getModel,
  modelMap,
  listCollaborators,
  manuscript,
  state,
  dispatch,
  hasFocus,
  doc,
  saveModel,
  deleteModel,
  saveManuscript,
  project,
  tags,
  openTemplateSelector,
}) => {
  const section = selectedSection
    ? getModel<Section>(selectedSection.node.attrs.id)
    : undefined

  const element = selectedElement
    ? getModel<AnyElement>(selectedElement.node.attrs.id)
    : undefined

  const statusLabels = useStatusLabels(manuscript.containerID, manuscript._id)

  const {
    getTemplate,
    getManuscriptCountRequirements,
    getSectionCountRequirements,
  } = useSharedData()

  const dispatchNodeAttrs = (
    id: string,
    attrs: Record<string, unknown>,
    nodispatch = false
  ) => {
    const { tr, doc } = state
    let transaction

    doc.descendants((node, pos) => {
      if (node.attrs.id === id) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          ...attrs,
        })
        if (nodispatch) {
          transaction = tr
        } else {
          dispatch(tr)
        }
      }
    })
    return transaction
  }

  return (
    <div>
      <StatisticsInspector
        manuscriptNode={doc as ActualManuscriptNode}
        sectionNode={
          selectedSection ? (selectedSection.node as SectionNode) : undefined
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
          state={state}
          dispatch={dispatch}
        />
      )}
      <ManuscriptInspector
        key={manuscript._id}
        manuscript={manuscript}
        modelMap={modelMap}
        saveManuscript={saveManuscript}
        saveModel={saveModel}
        state={state}
        dispatch={dispatch}
        deleteModel={deleteModel}
        openTemplateSelector={openTemplateSelector}
        getTemplate={getTemplate}
        getManuscriptCountRequirements={getManuscriptCountRequirements}
      />

      {(element || section) && config.features.projectManagement && (
        <ManageTargetInspector
          target={
            !hasFocus
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
            selectedSection ? (selectedSection.node as SectionNode) : undefined
          }
          state={state}
          dispatch={dispatch}
          modelMap={modelMap}
          saveModel={saveModel}
          dispatchNodeAttrs={dispatchNodeAttrs}
          getSectionCountRequirements={getSectionCountRequirements}
        />
      )}
    </div>
  )
}
