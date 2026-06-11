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
import {
  Actions,
  Capabilities,
} from '@manuscripts/body-editor'
import React from 'react'
import { ManuscriptActions } from '@manuscripts/transform'

export interface ProviderProps {
  WMsPermittedActions?: string[]
  manuscriptPermittedActions?: ManuscriptActions[]
  children?: React.ReactNode
  isViewingMode?: boolean
}
// all arguments are options to avoid empty object pass one context creation and
// thusly simplify the consuming of the context: it will help avoiding conditional
// checks which is helpful because there maybe numerous checks in on component

export const getCapabilities = (
  WMsActions?: string[],
  manuscriptActions?: ManuscriptActions[],
  isViewingMode?: boolean
): Capabilities => {
  const WMsAllowed = (action: Actions) => !!WMsActions?.includes(action)
  const ManAllowed = (action: ManuscriptActions) =>
    !!manuscriptActions?.includes(action)

  const canEditWithoutTracking = WMsAllowed(Actions.editWithoutTracking)
  const canEditFiles =
    ManAllowed(ManuscriptActions.canEditFiles) && !isViewingMode
  const canUpdateAttachments =
    canEditFiles && WMsAllowed(Actions.updateAttachment)

  return {
    /* track changes */
    handleSuggestion: ManAllowed(ManuscriptActions.handleSuggestion),
    editWithoutTracking: canEditWithoutTracking,
    rejectOwnSuggestion: ManAllowed(ManuscriptActions.rejectOwnSuggestion),

    /* comments */
    handleOwnComments: ManAllowed(ManuscriptActions.handleOwnComments),
    handleOthersComments: ManAllowed(ManuscriptActions.handleOthersComments),
    resolveOwnComment: ManAllowed(ManuscriptActions.resolveOwnComment),
    resolveOthersComment: ManAllowed(ManuscriptActions.resolveOthersComment),
    createComment: ManAllowed(ManuscriptActions.createComment),

    /* file handling */
    downloadFiles: true,
    changeDesignation: canUpdateAttachments,
    moveFile: canEditFiles,
    replaceFile: canUpdateAttachments,
    uploadFile: canUpdateAttachments,
    detachFile: canEditFiles,
    setMainManuscript: WMsAllowed(Actions.setMainManuscript),

    /* editor */
    editArticle: ManAllowed(ManuscriptActions.editArticle),
    formatArticle: ManAllowed(ManuscriptActions.formatArticle),
    editMetadata: ManAllowed(ManuscriptActions.editMetadata),
    editCitationsAndRefs: ManAllowed(ManuscriptActions.editCitationsAndRefs),
    seeEditorToolbar: ManAllowed(ManuscriptActions.seeEditorToolbar),
    seeReferencesButtons: ManAllowed(ManuscriptActions.seeReferencesButtons),
  }
}

const CapabilitiesContext = React.createContext<Capabilities>(getCapabilities())
CapabilitiesContext.displayName = 'CapabilitiesContext'

export const usePermissions = () => {
  return React.useContext(CapabilitiesContext)
}

export const useCalcPermission = ({
  WMsPermittedActions,
  manuscriptPermittedActions,
  isViewingMode,
}: ProviderProps) => {
  return getCapabilities(
    WMsPermittedActions,
    manuscriptPermittedActions,
    isViewingMode
  )
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
