/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import { Capabilities } from '@manuscripts/body-editor'
import React from 'react'

// Used to be two separate enums (@manuscripts/body-editor's Actions and
// @manuscripts/transform's ManuscriptActions) — permittedActions is now a
// single flat list with no such distinction, so the actions it can contain
// live here instead of in either package. Values must stay lowercase kebab-case:
// leanworkflow-api's Action.forName() lowercases everything, and these must match
// ManuscriptEditorAction's constants in leanworkflow-manuscripts-integration.
export enum Actions {
  updateAttachment = 'update-attachment',
  updateDueDate = 'update-due-date',
  addNote = 'add-note',
  setMainManuscript = 'set-main-manuscript',
  editWithoutTracking = 'edit-without-tracking',
  handleSuggestion = 'handle-suggestion',
  rejectOwnSuggestion = 'reject-own-suggestion',
  handleOwnComments = 'handle-own-comments',
  handleOthersComments = 'handle-others-comments',
  resolveOwnComment = 'resolve-own-comment',
  resolveOthersComment = 'resolve-others-comment',
  createComment = 'create-comment',
  canEditFiles = 'can-edit-files',
  editArticle = 'edit-article',
  formatArticle = 'format-article',
  editMetadata = 'edit-metadata',
  editCitationsAndRefs = 'edit-citations-and-refs',
  seeEditorToolbar = 'see-editor-toolbar',
  seeReferencesButtons = 'see-references-buttons',
}

export interface ProviderProps {
  permittedActions?: string[]
  children?: React.ReactNode
  isViewingMode?: boolean
}
// all arguments are options to avoid empty object pass one context creation and
// thusly simplify the consuming of the context: it will help avoiding conditional
// checks which is helpful because there maybe numerous checks in on component

export const getCapabilities = (
  permittedActions?: string[],
  isViewingMode?: boolean
): Capabilities => {
  const allowed = (action: Actions) => !!permittedActions?.includes(action)

  const canEditWithoutTracking = allowed(Actions.editWithoutTracking)
  const canEditFiles = allowed(Actions.canEditFiles) && !isViewingMode
  const canUpdateAttachments = canEditFiles && allowed(Actions.updateAttachment)

  return {
    /* track changes */
    handleSuggestion: allowed(Actions.handleSuggestion),
    editWithoutTracking: canEditWithoutTracking,
    rejectOwnSuggestion: allowed(Actions.rejectOwnSuggestion),

    /* comments */
    handleOwnComments: allowed(Actions.handleOwnComments),
    handleOthersComments: allowed(Actions.handleOthersComments),
    resolveOwnComment: allowed(Actions.resolveOwnComment),
    resolveOthersComment: allowed(Actions.resolveOthersComment),
    createComment: allowed(Actions.createComment),

    /* file handling */
    downloadFiles: true,
    changeDesignation: canUpdateAttachments,
    moveFile: canEditFiles,
    replaceFile: canUpdateAttachments,
    uploadFile: canUpdateAttachments,
    detachFile: canEditFiles,
    setMainManuscript: allowed(Actions.setMainManuscript),

    /* editor */
    editArticle: allowed(Actions.editArticle),
    formatArticle: allowed(Actions.formatArticle),
    editMetadata: allowed(Actions.editMetadata),
    editCitationsAndRefs: allowed(Actions.editCitationsAndRefs),
    seeEditorToolbar: allowed(Actions.seeEditorToolbar),
    seeReferencesButtons: allowed(Actions.seeReferencesButtons),
  }
}

const CapabilitiesContext = React.createContext<Capabilities>(getCapabilities())
CapabilitiesContext.displayName = 'CapabilitiesContext'

export const usePermissions = () => {
  return React.useContext(CapabilitiesContext)
}

export const useCalcPermission = ({
  permittedActions,
  isViewingMode,
}: ProviderProps) => {
  return getCapabilities(permittedActions, isViewingMode)
}
export const CapabilitiesProvider: React.FC<{
  can: Capabilities
  children: React.ReactNode
}> = (props) => {
  const { can } = props
  return (
    <CapabilitiesContext.Provider value={can}>
      {props?.children}
    </CapabilitiesContext.Provider>
  )
}
