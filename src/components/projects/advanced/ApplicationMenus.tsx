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
  ApplicationMenus as EditorMenus,
  DialogController,
  DialogNames,
  getMenus,
  MenuSpec,
  useApplicationMenus,
  useEditor,
} from '@manuscripts/body-editor'
import { usePermissions } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'

import config from '../../../config'
import { addColor, buildColors } from '../../../lib/colors'
import { useStore } from '../../../store'

export const ApplicationMenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface Props {
  editor: ReturnType<typeof useEditor>
  contentEditable: boolean
}

export const ApplicationMenus: React.FC<Props> = ({
  editor,
  contentEditable,
}) => {
  const [store] = useStore((store) => ({
    manuscriptID: store.manuscriptID,
    userID: store.userID,
    modelMap: store.modelMap,
    saveModel: store.saveModel,
    manuscripts: store.manuscripts,
    project: store.project,
    getAttachment: store.getAttachment,
    saveNewManuscript: store.saveNewManuscript,
  }))

  const history = useHistory()
  const can = usePermissions()

  const helpMenu: MenuSpec = {
    id: 'help',
    label: 'Help',
    submenu: [
      {
        id: 'documentation',
        label: 'Documentation',
        run: () => window.open('https://support.manuscripts.io/'),
      },
      {
        role: 'separator',
      },
      {
        id: 'project-diagnostics',
        label: 'View Diagnostics',
        run: () => history.push(`/projects/${store.project._id}/diagnostics`),
      },
    ],
  }

  const [dialog, setDialog] = useState<DialogNames | null>(null)
  const closeDialog = () => setDialog(null)
  const openDialog = (dialog: DialogNames) => setDialog(dialog)
  const { colors, colorScheme } = buildColors(store.modelMap)
  const handleAddColor = addColor(colors, store.saveModel, colorScheme)
  let editorMenu = getMenus(
    editor,
    openDialog,
    config.features.footnotes,
    contentEditable
  )
  if (!can.formatArticle) {
    editorMenu = editorMenu.filter((menu) => menu.id !== 'format')
  }

  const menu = [...editorMenu, helpMenu]

  const menus = useApplicationMenus(menu)

  return (
    <>
      <DialogController
        currentDialog={dialog}
        handleCloseDialog={closeDialog}
        colors={colors}
        handleAddColor={handleAddColor}
        editorState={editor.state}
        dispatch={editor.dispatch}
      />
      <EditorMenus {...menus} />
    </>
  )
}
