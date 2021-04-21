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
  Manuscript,
  ObjectTypes,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React, { useState } from 'react'

interface ChildProps {
  handleRequestDelete: (model: Project | Manuscript) => void
}

interface Props {
  handleDelete: (model: Project | Manuscript) => Promise<void>
  children: (props: ChildProps) => JSX.Element | null
}

const extractDeleteMessage = (model: Project | Manuscript) => {
  const modelType =
    model.objectType === ObjectTypes.Project ? 'project' : 'manuscript'
  return model.title
    ? `Are you sure you wish to delete the ${modelType} ${model.title}?`
    : `Are you sure you wish to delete this untitled ${modelType}?`
}

export const DeleteConfirmationDialog: React.FC<Props> = ({
  handleDelete,
  children,
}) => {
  const [thingToDelete, setThing] = useState<Project | Manuscript | null>(null)

  const actions = {
    primary: {
      action: () => {
        handleDelete(thingToDelete!)
        setThing(null)
      },
      title: 'Delete',
      isDestructive: true,
    },
    secondary: {
      action: () => setThing(null),
      title: 'Cancel',
    },
  }

  return (
    <React.Fragment>
      {children({ handleRequestDelete: setThing })}
      {thingToDelete ? (
        <Dialog
          isOpen={true}
          actions={actions}
          category={Category.confirmation}
          header={`Delete ${
            thingToDelete.objectType === ObjectTypes.Project
              ? 'Project'
              : 'Manuscript'
          }`}
          message={extractDeleteMessage(thingToDelete)}
          confirmFieldText={'DELETE'}
        />
      ) : null}
    </React.Fragment>
  )
}
