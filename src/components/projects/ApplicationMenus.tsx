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
  getMenus,
  MenuSpec,
  useApplicationMenus,
} from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorState,
  ManuscriptTransaction,
} from '@manuscripts/manuscript-transform'
import React, { useEffect, useState } from 'react'

import config from '../../config'
import { useCrisp } from '../../hooks/use-crisp'
import { addColor, buildColors } from '../../lib/colors'
import { createDispatchMenuAction } from '../../lib/native'
import { buildProjectMenu, ProjectMenuProps } from '../../lib/project-menu'

type Command = (
  state: ManuscriptEditorState,
  dispatch?: (tr: ManuscriptTransaction) => void
) => boolean

export const createMenuSpec = (
  props: ProjectMenuProps,
  openDialog: (dialog: DialogNames) => void,
  openChat: () => void
): MenuSpec[] => {
  const { view } = props
  const { state, dispatch } = view
  const doCommand = (command: Command) => command(state, dispatch)
  const isCommandValid = (command: Command) => !!command(state)

  const developMenu: MenuSpec = {
    id: 'develop',
    label: 'Develop',
    submenu: [
      {
        id: 'import',
        label: 'Import Manuscript…',
        run: props.openImporter,
      },
    ],
  }

  const helpMenu: MenuSpec = {
    id: 'help',
    label: 'Help',
    submenu: [
      {
        id: 'community',
        label: 'Community',
        run: () => window.open('https://community.manuscripts.io/'),
      },
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
        run: () =>
          props.history.push(`/projects/${props.project._id}/diagnostics`),
      },
    ],
  }
  if (config.crisp.id) {
    helpMenu.submenu!.push(
      {
        role: 'separator',
      },
      {
        id: 'support',
        label: 'Support',
        run: () => openChat(),
      }
    )
  }

  const menu = [
    buildProjectMenu(props),
    ...getMenus(
      {
        state,
        doCommand,
        isCommandValid,
      } as any,
      openDialog,
      config.features.footnotes
    ),
    helpMenu,
  ]
  if (!config.production) {
    menu.push(developMenu)
  }
  return menu
}

export const ManuscriptPageMenus: React.FC<ProjectMenuProps> = (props) => {
  const [dialog, setDialog] = useState<DialogNames | null>(null)
  const closeDialog = () => setDialog(null)
  const openDialog = (dialog: DialogNames) => setDialog(dialog)
  const { colors, colorScheme } = buildColors(props.modelMap)
  const handleAddColor = addColor(colors, props.saveModel, colorScheme)

  const crisp = useCrisp()
  const openChat = crisp.open

  const spec = createMenuSpec(props, openDialog, openChat)

  useEffect(() => {
    window.dispatchMenuAction = createDispatchMenuAction(spec)
    window.getMenuState = () => spec
  }, [spec])

  const { menuState, wrapperRef, handleItemClick } = useApplicationMenus(spec)

  return (
    <React.Fragment>
      <DialogController
        currentDialog={dialog}
        handleCloseDialog={closeDialog}
        editorState={props.view.state}
        dispatch={props.view.dispatch}
        colors={colors}
        handleAddColor={handleAddColor}
      />
      <ApplicationMenus
        menuState={menuState}
        wrapperRef={wrapperRef}
        handleItemClick={handleItemClick}
      />
    </React.Fragment>
  )
}
