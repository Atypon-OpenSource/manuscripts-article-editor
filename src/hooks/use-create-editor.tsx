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
  ManuscriptsEditor,
  PopperManager,
  useEditor,
} from '@manuscripts/manuscript-editor'
import {
  getModelsByType,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import { ExternalFile, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import { usePermissions } from '@manuscripts/style-guide'
import React, { ReactChild, ReactNode, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useHistory } from 'react-router'

import CitationEditor from '../components/library/CitationEditor'
import { CitationViewer } from '../components/library/CitationViewer'
import { ReferencesViewer } from '../components/library/ReferencesViewer'
import useFileHandling from '../components/projects/lean-workflow/FileHandling'
import config from '../config'
import { useUploadAttachment } from '../lib/lean-workflow-gql'
import { useStore } from '../store'
import { theme } from '../theme/theme'
import { ThemeProvider } from '../theme/ThemeProvider'

interface Permissions {
  write: boolean
}
export const useCreateEditor = (permissions: Permissions) => {
  const [
    {
      doc,
      ancestorDoc,
      manuscript,
      project,
      user,
      biblio,
      modelMap,
      getModel,
      saveModel,
      deleteModel,
      commitAtLoad,
      submissionId,
    },
  ] = useStore((store) => ({
    doc: store.doc,
    ancestorDoc: store.ancestorDoc,
    manuscript: store.manuscript,
    project: store.project,
    user: store.user,
    biblio: store.biblio,
    modelMap: store.modelMap,
    getModel: store.getModel,
    saveModel: store.saveModel,
    deleteModel: store.deleteModel,
    putAttachment: store.putAttachment,
    submissionId: store.submissionID || '',
    commitAtLoad: store.commitAtLoad,
  }))

  const can = usePermissions()
  const popper = useRef<PopperManager>(new PopperManager())
  const { handleChangeAttachmentDesignation } = useFileHandling()

  const { uploadAttachment } = useUploadAttachment()

  const putAttachment = (file: File, designation = 'supplementary') => {
    return uploadAttachment({
      submissionId,
      file: file,
      designation: designation,
    })
      .then(({ data }) => {
        return data.uploadAttachment?.link
      })
      .catch((e) => {
        console.error(e)
        return null
      })
  }

  const retrySync = (componentIDs: string[]) => {
    componentIDs.forEach((id) => {
      const model = getModel(id)
      if (!model) {
        return
      }
      saveModel(model)
    })
    return Promise.resolve()
  }

  const files = getModelsByType<ExternalFile>(
    modelMap,
    ObjectTypes.ExternalFile
  )

  const history = useHistory()

  const editorProps = {
    attributes: {
      class: 'manuscript-editor',
      lang: 'en-GB',
      spellcheck: 'true',
      tabindex: '2',
    },
    doc,

    locale: manuscript.primaryLanguageCode || 'en-GB',
    permissions: permissions,
    environment: config.environment,
    history,
    popper: popper.current,
    projectID: project._id,

    // refactor the library stuff to a hook-ish type thingy
    ...biblio,

    // model and attachment retrieval:
    modelMap,
    getManuscript: () => manuscript,
    getCurrentUser: () => user,
    getModel,
    saveModel,
    deleteModel,
    putAttachment: putAttachment,
    retrySync,

    renderReactComponent: (child: ReactNode, container: HTMLElement) => {
      if (child && typeof child !== 'boolean') {
        ReactDOM.render(
          <ThemeProvider>{child as ReactChild}</ThemeProvider>,
          container
        )
      }
    },
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      ReferencesViewer,
      CitationEditor,
      CitationViewer,
    },

    ancestorDoc: ancestorDoc,
    commit: commitAtLoad || null,
    externalFiles: files,
    theme,
    submissionId,
    capabilities: can,
    updateDesignation: (designation: string, name: string) =>
      handleChangeAttachmentDesignation(submissionId, designation, name),
    uploadAttachment: (designation: string, file: File) =>
      putAttachment(file, designation),
  }

  const editor = useEditor<ManuscriptSchema>(
    ManuscriptsEditor.createState(editorProps),
    ManuscriptsEditor.createView(editorProps)
  )

  return editor
}
