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
  DialogController,
  DialogNames,
  EditorHookValue,
  getMenus,
  MenuSpec,
  useApplicationMenus,
} from '@manuscripts/manuscript-editor'
import {
  ContainedModel,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import { Model, Project } from '@manuscripts/manuscripts-json-schema'
import { History } from 'history'
import React, { useState } from 'react'
import styled from 'styled-components'

import config from '../../../config'
import { remaster } from '../../../lib/bootstrap-manuscript'
import { addColor, buildColors } from '../../../lib/colors'
import {
  buildExportMenu,
  buildExportReferencesMenu,
} from '../../../lib/project-menu'
import { ExportFormat } from '../../../pressroom/exporter'
import { Collection } from '../../../sync/Collection'
import { SaveModel } from '../../inspector/StyleFields'
import { ModalProps } from '../../ModalProvider'
import { Exporter } from '../Exporter'

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
  saveModel: SaveModel
}

export const ApplicationMenusLW: React.FC<Props> = ({
  history,
  editor,
  addModal,
  manuscriptID,
  modelMap,
  saveModel,
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
        id: 'remaster',
        label: 'Remaster',
        run: () => remaster(editor.state, modelMap, project, manuscriptID),
      },
    ],
  }

  const [dialog, setDialog] = useState<DialogNames | null>(null)
  const closeDialog = () => setDialog(null)
  const openDialog = (dialog: DialogNames) => setDialog(dialog)
  const { colors, colorScheme } = buildColors(modelMap)
  const handleAddColor = addColor(colors, saveModel, colorScheme)

  const menus = useApplicationMenus([
    projectMenu,
    ...getMenus(editor, openDialog, config.features.footnotes),
  ])

  return (
    <React.Fragment>
      <DialogController
        currentDialog={dialog}
        handleCloseDialog={closeDialog}
        colors={colors}
        handleAddColor={handleAddColor}
        editorState={editor.state}
        dispatch={editor.dispatch}
      />
      <ApplicationMenus {...menus} />
    </React.Fragment>
  )
}
