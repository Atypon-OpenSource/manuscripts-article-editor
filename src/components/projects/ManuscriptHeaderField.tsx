/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { Build, generateID } from '@manuscripts/manuscript-transform'
import { Figure, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { SaveModel } from './ManuscriptInspector'

export const ManuscriptHeaderField: React.FC<{
  value?: string
  handleChange: (value?: string) => void
  saveModel: SaveModel
  deleteModel: (id: string) => Promise<string>
}> = ({ value, handleChange, saveModel, deleteModel }) => {
  return (
    <div>
      <label>
        <input
          type={'checkbox'}
          checked={value !== undefined}
          onChange={async (event) => {
            if (event.target.checked) {
              const figure: Build<Figure> = {
                _id: generateID(ObjectTypes.Figure),
                objectType: ObjectTypes.Figure,
              }

              await saveModel<Figure>(figure)

              handleChange(figure._id)
            } else {
              if (value) {
                try {
                  await deleteModel(value)
                } catch (error) {
                  console.error(error)
                }
              }

              handleChange(undefined)
            }
          }}
        />{' '}
        Header image is shown
      </label>
    </div>
  )
}
