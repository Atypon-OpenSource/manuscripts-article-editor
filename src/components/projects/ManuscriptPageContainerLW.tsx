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

import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import '@reach/tabs/styles.css'

import {
  findParentNodeWithIdValue,
  ManuscriptsEditor,
  ManuscriptToolbar,
  PopperManager,
  RequirementsProvider,
  useEditor,
} from '@manuscripts/manuscript-editor'
import {
  Build,
  ContainedModel,
  ManuscriptNode,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Correction,
  Manuscript,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import { Commit } from '@manuscripts/track-changes'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { RouteComponentProps } from 'react-router'

import config from '../../config'
import { Biblio, useBiblio } from '../../hooks/use-biblio'
import { useCommits } from '../../hooks/use-commits'
import { SnapshotStatus, useHistory } from '../../hooks/use-history'
import { useManuscriptModels } from '../../hooks/use-manuscript-models'
import { Collection } from '../../sync/Collection'
import { InspectorContainer } from '../Inspector'
import { IntlProps, withIntl } from '../IntlProvider'
import CitationEditor from '../library/CitationEditor'
import { CitationViewer } from '../library/CitationViewer'
import MetadataContainer from '../metadata/MetadataContainer'
import { ModalProps, withModal } from '../ModalProvider'
import { Main } from '../Page'
import Panel from '../Panel'
import { ManuscriptPlaceholder } from '../Placeholders'
import { ResizingInspectorButton } from '../ResizerButtons'
import { Corrections } from '../track/Corrections'
import {
  ApplicationMenuContainer,
  ApplicationMenusLW as ApplicationMenus,
} from './ApplicationMenusLW'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from './EditorContainer'
import { EditorStyles } from './EditorStyles'
import { ManuscriptPageContainerProps } from './ManuscriptPageContainer'
import ManuscriptSidebar from './ManuscriptSidebar'
import { ReloadDialog } from './ReloadDialog'
interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = ManuscriptPageContainerProps &
  RouteComponentProps<RouteParams> &
  IntlProps &
  ModalProps

/**
 * TODO: The two wrapping components should be removed, and replaced with a
 * generic hook that takes a promise and returns { data, loadStatus, error }
 *
 * The promise should be a single long function composed out of smaller, testable
 * functions.
 */

const ManuscriptPageContainer: React.FC<CombinedProps> = (props) => {
  const { project, match } = props
  const {
    loadSnapshotStatus,
    loadSnapshot,
    currentSnapshot,
    snapshotsList,
  } = useHistory(project._id)

  const latestSnaphotID = snapshotsList.length ? snapshotsList[0].s3Id : null

  useEffect(() => {
    if (!latestSnaphotID) {
      return
    }
    loadSnapshot(latestSnaphotID, match.params.manuscriptID)
  }, [project._id, match.params.manuscriptID, latestSnaphotID, loadSnapshot])

  const manuscriptModels = useManuscriptModels(
    project._id,
    match.params.manuscriptID
  )
  const biblio = useBiblio({
    bundle: manuscriptModels.bundle,
    library: props.library,
    collection: manuscriptModels.collection,
    lang: props.manuscript.primaryLanguageCode || 'en-GB',
  })

  if (
    loadSnapshotStatus !== SnapshotStatus.Done ||
    !currentSnapshot ||
    !manuscriptModels.map
  ) {
    return <ManuscriptPlaceholder />
  } else if (manuscriptModels.error) {
    return <ReloadDialog message={manuscriptModels.error} />
  }

  return (
    <ManuscriptPageInner
      doc={currentSnapshot.doc}
      modelMap={manuscriptModels.map}
      snapshotID={latestSnaphotID!}
      {...manuscriptModels}
      {...biblio}
      {...props}
    />
  )
}

interface ManuscriptPageInnerProps extends CombinedProps {
  doc: ManuscriptNode
  snapshotID: string
  modelMap: Map<string, Model>
  getModel: <T extends Model>(id: string) => T | undefined
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  deleteModel: (id: string) => Promise<string>
  collection: Collection<ContainedModel>
  bundle: Bundle | null
}

const ManuscriptPageInner: React.FC<ManuscriptPageInnerProps & Biblio> = (
  props
) => {
  const { modelMap, project } = props

  const commits = useCommits(modelMap, project._id, props.snapshotID)

  if (commits.load !== 2) {
    console.log(commits.load)
    return null
  }

  return <ManuscriptPageView {...props} {...commits} />
}

interface ManuscriptPageViewProps extends ManuscriptPageInnerProps {
  commitAtLoad: Commit | null
  commits: Commit[]
  corrections: Correction[]
  saveCommit: (commit: Commit) => void
}

const ManuscriptPageView: React.FC<ManuscriptPageViewProps & Biblio> = (
  props
) => {
  const {
    manuscript,
    project,
    user,
    history,
    doc,
    modelMap,
    getModel,
    saveModel,
    deleteModel,
  } = props

  const popper = useRef<PopperManager>(new PopperManager())

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

  const editorProps = {
    doc,

    locale: manuscript.primaryLanguageCode || 'en-GB',
    permissions: { write: true },
    environment: config.environment,
    history,
    popper: popper.current,
    projectID: project._id,

    // refactor the library stuff to a hook-ish type thingy
    getCitationProcessor: () => props.citationProcessor,
    setLibraryItem: props.setLibraryItem,
    getLibraryItem: props.getLibraryItem,
    matchLibraryItemByIdentifier: props.matchLibraryItemByIdentifier,
    filterLibraryItems: props.filterLibraryItems,

    // model and attachment retrieval:
    modelMap,
    getManuscript: () => manuscript,
    getCurrentUser: () => user,
    getModel,
    saveModel,
    deleteModel,
    putAttachment: () => {
      console.log('put attachment')
      return Promise.resolve('attachment id')
    },
    setCommentTarget: console.log,
    retrySync,

    renderReactComponent: ReactDOM.render,
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      CitationEditor,
      CitationViewer,
    },
    commit: props.commitAtLoad,
  }

  const editor = useEditor<ManuscriptSchema>(
    ManuscriptsEditor.createState(editorProps),
    ManuscriptsEditor.createView(editorProps)
  )
  const { state, onRender, view } = editor

  return (
    <RequirementsProvider modelMap={modelMap}>
      <ManuscriptSidebar
        project={project}
        manuscript={manuscript}
        view={view}
        doc={doc}
        permissions={editorProps.permissions}
        manuscripts={props.manuscripts}
        user={user}
        tokenActions={props.tokenActions}
        saveModel={saveModel}
        selected={findParentNodeWithIdValue(state.selection) || null}
      />
      <Main>
        <EditorContainer>
          <EditorContainerInner>
            <EditorHeader>
              <ApplicationMenuContainer>
                <ApplicationMenus
                  history={props.history}
                  editor={editor}
                  addModal={props.addModal}
                  manuscriptID={manuscript._id}
                  modelMap={modelMap}
                  project={project}
                  collection={props.collection}
                />
              </ApplicationMenuContainer>
              <ManuscriptToolbar view={view} />
            </EditorHeader>
            <EditorBody>
              <MetadataContainer
                manuscript={manuscript}
                saveManuscript={props.saveManuscript}
                handleTitleStateChange={() => '' /*FIX THIS*/}
                saveModel={saveModel}
                deleteModel={deleteModel}
                permissions={editorProps.permissions}
                tokenActions={props.tokenActions}
                getAttachment={props.collection.getAttachmentAsBlob}
                putAttachment={props.collection.putAttachment}
              />
              <EditorStyles modelMap={modelMap}>
                <div id="editor" ref={onRender}></div>
              </EditorStyles>
            </EditorBody>
          </EditorContainerInner>
        </EditorContainer>
      </Main>
      <Panel
        name="history"
        minSize={300}
        direction="row"
        side="start"
        hideWhen="max-width: 900px"
        resizerButton={ResizingInspectorButton}
      >
        <InspectorContainer>
          <Corrections
            editor={editor}
            corrections={props.corrections}
            commits={props.commits}
            saveCorrection={saveModel}
            saveCommit={props.saveCommit}
            collaborators={props.collaboratorsById}
            user={props.user}
            containerID={project._id}
            manuscriptID={manuscript._id}
            snapshotID={props.snapshotID}
          />
        </InspectorContainer>
      </Panel>
    </RequirementsProvider>
  )
}

export default withModal(withIntl(ManuscriptPageContainer))
