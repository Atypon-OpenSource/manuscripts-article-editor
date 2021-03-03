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
  ApplicationMenus,
  EditorHookValue,
  getMenus,
  MenuSpec,
  useApplicationMenus,
} from '@manuscripts/manuscript-editor'
import {
  ContainedModel,
  DEFAULT_PAGE_LAYOUT,
  fromPrototype,
  isManuscript,
  isManuscriptModel,
  loadBundledDependencies,
  ManuscriptSchema,
  StyleObject,
  updatedPageLayout,
} from '@manuscripts/manuscript-transform'
import { Model, Project } from '@manuscripts/manuscripts-json-schema'
import { History } from 'history'
import React from 'react'
import styled from 'styled-components'

import { remaster } from '../../../lib/bootstrap-manuscript'
import { loadBundle } from '../../../lib/bundles'
import { nextManuscriptPriority } from '../../../lib/manuscript'
import {
  buildExportMenu,
  buildExportReferencesMenu,
} from '../../../lib/project-menu'
import { ExportFormat } from '../../../pressroom/exporter'
import { Collection } from '../../../sync/Collection'
import { ModalProps } from '../../ModalProvider'
import { Exporter } from '../Exporter'
import { Importer } from '../Importer'

export const ApplicationMenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface Props {
  editor: EditorHookValue<ManuscriptSchema>
  history: History
  project: Project
  manuscriptID: string
  addModal: ModalProps['addModal']
  collection: Collection<ContainedModel>
  modelMap: Map<string, Model>
}

export const ApplicationMenusLW: React.FC<Props> = ({
  history,
  editor,
  addModal,
  manuscriptID,
  modelMap,
  project,
  collection,
}) => {
  const openExporter = (format: ExportFormat, closeOnSuccess: boolean) => {
    addModal('exporter', ({ handleClose }) => (
      <Exporter
        format={format}
        getAttachment={collection.getAttachmentAsBlob}
        handleComplete={handleClose}
        modelMap={modelMap}
        manuscriptID={manuscriptID}
        project={project}
        closeOnSuccess={closeOnSuccess}
      />
    ))
  }

  // IMPORT DOES NOT NEED TO BE IN LEAN_WORKFLOW
  // REMOVE THIS AND openImporter after Demo on 2021/02/18
  const importManuscript = async (models: Model[], redirect = true) => {
    const projectID = project._id

    const manuscript = models.find(isManuscript)

    if (!manuscript) {
      throw new Error('No manuscript found')
    }

    // TODO: try to share this code with createManuscript

    manuscript.priority = await nextManuscriptPriority(collection)

    // TODO: use the imported filename?
    if (!manuscript.pageLayout) {
      if (!models.find((model) => model._id === manuscript.bundle)) {
        const [bundle, parentBundle] = await loadBundle(manuscript.bundle)
        manuscript.bundle = bundle._id
        models.push(bundle)

        if (parentBundle) {
          models.push(parentBundle)
        }
      }

      const dependencies = await loadBundledDependencies()
      const prototypedDependencies = dependencies.map(fromPrototype)
      models.push(...prototypedDependencies)

      const styleMap = new Map(
        prototypedDependencies.map((style) => [style._id, style])
      )
      const pageLayout = updatedPageLayout(
        styleMap as Map<string, StyleObject>,
        DEFAULT_PAGE_LAYOUT
      )
      manuscript.pageLayout = pageLayout._id
      models.push(pageLayout)

      // TODO: apply a template?
    }

    // TODO: save dependencies first, then the manuscript
    // TODO: handle multiple manuscripts in a project bundle

    const items = models.map((model) => ({
      ...model,
      containerID: projectID,
      manuscriptID: isManuscriptModel(model) ? manuscript._id : undefined,
    }))

    await collection.bulkCreate(items)

    if (redirect) {
      history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)
    }
  }

  const openImporter = () => {
    addModal('importer', ({ handleClose }) => (
      <Importer
        handleComplete={handleClose}
        importManuscript={importManuscript}
      />
    ))
  }
  // END FUNCTIONS TO REMOVE

  const projectMenu: MenuSpec = {
    id: 'project',
    label: 'Project',
    submenu: [
      buildExportMenu(openExporter),
      buildExportReferencesMenu(openExporter, editor.state),
      {
        id: 'project-diagnostics',
        label: 'View Diagnostics',
        run: () => history.push(`/projects/${project._id}/diagnostics`),
      },
      {
        role: 'separator',
      },
      {
        id: 'import',
        label: 'Import Manuscript…',
        run: openImporter,
      },
      {
        role: 'separator',
      },
      {
        id: 'remaster',
        label: 'Remaster',
        run: () => remaster(editor.state, project),
      },
    ],
  }

  const menus = useApplicationMenus([projectMenu, ...getMenus(editor)])

  return <ApplicationMenus {...menus} />
}
