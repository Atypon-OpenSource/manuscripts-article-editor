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

import { Figure, Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import { useStore } from '../../store'
import { InspectorSection, Subheading } from '../InspectorSection'
import { DescriptionInput } from './DescriptionInput'
import { ManuscriptHeaderField } from './ManuscriptHeaderField'

export type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export const HeaderImageInspector: React.FC = () => {
  const [data] = useStore((store) => {
    return {
      deleteModel: store.deleteModel,
      manuscript: store.manuscript,
      modelMap: store.modelMap,
      saveManuscript: store.saveManuscript,
      saveModel: store.saveModel,
    }
  })
  const { deleteModel, manuscript, modelMap, saveManuscript, saveModel } = data

  const headerFigure = manuscript.headerFigure
    ? (modelMap.get(manuscript.headerFigure) as Figure | undefined)
    : undefined

  return (
    <InspectorSection title={'Header Image'}>
      <ManuscriptHeaderField
        value={manuscript.headerFigure}
        handleChange={async (headerFigure) => {
          await saveManuscript({ headerFigure })
        }}
        saveModel={saveModel}
        deleteModel={deleteModel}
      />

      {headerFigure && (
        <>
          <Subheading>Caption</Subheading>

          <DescriptionInput
            placeholder={'Image caption…'}
            value={headerFigure.title}
            handleChange={async (title) => {
              await saveModel({
                ...headerFigure,
                title,
              })
            }}
          />
        </>
      )}
    </InspectorSection>
  )
}
