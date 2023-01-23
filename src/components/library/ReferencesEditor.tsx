/*!
 * © 2023 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BibliographyItem, Model, ObjectTypes } from '@manuscripts/json-schema'
import { Build } from '@manuscripts/transform'
import React, { useCallback, useEffect, useState } from 'react'
import { CitationModel } from './CitationModel'

interface Props {
  filterLibraryItems: (query: string) => Promise<BibliographyItem[]>
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  setLibraryItem: (item: BibliographyItem) => void
  removeLibraryItem: (id: string) => void
  modelMap: Map<string, Model>
  referenceID?: string
}

export const ReferencesEditor: React.FC<Props> = (props) => {
  const {
    filterLibraryItems,
    saveModel,
    deleteModel,
    setLibraryItem,
    removeLibraryItem,
    referenceID,
    modelMap,
  } = props

  const [showEditModel, setShowEditModel] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BibliographyItem>()

  useEffect(() => {
    if (referenceID) {
      const reference = modelMap.get(referenceID) as BibliographyItem
      setSelectedItem(reference)
      setShowEditModel(true)
    }
  }, [referenceID, modelMap])

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
  }, [selectedItem, modelMap, deleteModel, removeLibraryItem])

  const component = (
    <CitationModel
      editCitation={showEditModel}
      modelMap={modelMap}
      saveCallback={saveCallback}
      selectedItem={selectedItem}
      deleteCallback={deleteReferenceCallback}
      setSelectedItem={setSelectedItem}
      setShowEditModel={setShowEditModel}
      getReferences={filterLibraryItems}
    />
  )

  return component
}
