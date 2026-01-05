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
import { Actions, Capabilities } from '@manuscripts/body-editor'
import React from 'react'
import {Project, UserProfile} from "@manuscripts/transform";

export interface ProviderProps {
  project?: Project
  profile?: UserProfile
  role?: string
  permittedActions?: string[]
  children?: React.ReactNode
  isViewingMode?: boolean
}
// all arguments are options to avoid empty object pass one context creation and
// thusly simplify the consuming of the context: it will help avoiding conditional
// checks which is helpful because there maybe numerous checks in on component

export const getCapabilities = (
  project?: Project,
  profile?: UserProfile,
  role?: ProviderProps['role'],
  actions?: string[],
  isViewingMode?: boolean
): Capabilities => {
  const userID = profile?.userID

  const isMemberOf = (group?: string[]) =>
    group?.includes(userID ?? '') ?? false

  const isOwner = isMemberOf(project?.owners)
  const isEditor = isMemberOf(project?.editors)
  const isWriter = isMemberOf(project?.writers)
  const isAnnotator = isMemberOf(project?.annotators)
  const isViewer = isMemberOf(project?.viewers) || isViewingMode

  const allowed = (action: string) => !!actions?.includes(action)

  const canEditWithoutTracking = allowed(Actions.editWithoutTracking)
  const isPrivileged = isOwner || isEditor || isWriter
  const canEditFiles = (isPrivileged || isAnnotator) && !isViewingMode
  const canUpdateAttachments = canEditFiles && allowed(Actions.updateAttachment)

  return {
    /* track changes */
    handleSuggestion: isPrivileged,
    editWithoutTracking: canEditWithoutTracking,
    rejectOwnSuggestion: !isViewer,

    /* comments */
    handleOwnComments: !isViewer,
    handleOthersComments: isOwner,
    resolveOwnComment: !isViewer,
    resolveOthersComment: isOwner || isEditor,
    createComment: !isViewer,

    /* file handling */
    downloadFiles: true,
    changeDesignation: canUpdateAttachments,
    moveFile: canEditFiles,
    replaceFile: canUpdateAttachments,
    uploadFile: canUpdateAttachments,
    detachFile: canEditFiles,
    setMainManuscript: allowed(Actions.setMainManuscript),

    /* editor */
    editArticle: !isViewer,
    formatArticle: !isViewer,
    editMetadata: !isViewer,
    editCitationsAndRefs: !isViewer,
    seeEditorToolbar: !isViewer,
    seeReferencesButtons: !isViewer,
  }
}

const CapabilitiesContext = React.createContext<Capabilities>(getCapabilities())
CapabilitiesContext.displayName = 'CapabilitiesContext'

export const usePermissions = () => {
  return React.useContext(CapabilitiesContext)
}

export const useCalcPermission = ({
  project,
  profile,
  role,
  permittedActions,
  isViewingMode,
}: ProviderProps) => {
  return getCapabilities(
    project,
    profile,
    role,
    permittedActions,
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
