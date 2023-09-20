/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */

import { BibliographyItem, Model, ObjectTypes } from '@manuscripts/json-schema'
import { Build } from '@manuscripts/transform'
import React, { useCallback, useEffect, useState } from 'react'

import { CitationModel } from './CitationModel'

interface Props {
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  setLibraryItem: (item: BibliographyItem) => void
  removeLibraryItem: (id: string) => void
  getModelMap: () => Map<string, Model>
  referenceID?: string
}

export const ReferencesEditor: React.FC<Props> = (props) => {
  const {
    saveModel,
    deleteModel,
    setLibraryItem,
    removeLibraryItem,
    referenceID,
    getModelMap,
  } = props
  const modelMap = getModelMap()

  const [showEditModel, setShowEditModel] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BibliographyItem>()

  useEffect(() => {
    if (referenceID) {
      const reference = getModelMap().get(referenceID) as BibliographyItem
      setSelectedItem(reference)
      setShowEditModel(true)
    }
  }, [referenceID, getModelMap])

  const saveCallback = useCallback(
    async (item) => {
      await saveModel({ ...item, objectType: ObjectTypes.BibliographyItem })
      setLibraryItem(item)
    },
    [saveModel, setLibraryItem]
  )

  const deleteReferenceCallback = useCallback(async () => {
    if (selectedItem) {
      await deleteModel(selectedItem._id)
      removeLibraryItem(selectedItem._id)
    }
  }, [selectedItem, deleteModel, removeLibraryItem])

  const component = (
    <CitationModel
      editCitation={showEditModel}
      modelMap={modelMap}
      saveCallback={saveCallback}
      selectedItem={selectedItem}
      deleteCallback={deleteReferenceCallback}
      setSelectedItem={setSelectedItem}
      setShowEditModel={setShowEditModel}
    />
  )

  return component
}
