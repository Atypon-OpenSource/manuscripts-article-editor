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
import AnnotationEdit from '@manuscripts/assets/react/AnnotationEdit'
import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import {
  BibliographyItem,
  Citation,
  CommentAnnotation,
  Model,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { shortLibraryItemMetadata } from '@manuscripts/library'
import {
  AddComment,
  ButtonGroup,
  Category,
  Dialog,
  IconButton,
  IconTextButton,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import {
  Build,
  buildBibliographyItem,
  buildComment,
  getModelsByType,
} from '@manuscripts/transform'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { CitationModel } from './CitationModel'
import { CitationSearch } from './CitationSearch'

const CitedItem = styled.div`
  padding: ${(props) => props.theme.grid.unit * 4}px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.secondary};
  }
`

const textOverflow = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const CitedItemTitle = styled(Title)<{ withOverflow?: boolean }>`
  ${(props) => props.withOverflow && textOverflow}
`

export const CitedItemMetadata = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.light};
  margin-top: ${(props) => props.theme.grid.unit}px;
  ${textOverflow}
`

const CitedItemActionLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`

const CitedItemActions = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  svg.remove-icon {
    height: ${(props) => props.theme.grid.unit * 4}px;
    width: ${(props) => props.theme.grid.unit * 4}px;
  }
`

const CitedItems = styled.div`
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  font-family: ${(props) => props.theme.font.family.sans};
  max-height: 70vh;
  min-height: 100px;
  overflow-y: auto;
`

const ActionButton = styled(IconButton).attrs({
  size: 24,
})`
  :disabled {
    background-color: transparent !important;
    border-color: transparent !important;
    color: rgb(255, 255, 255);
    path,
    g {
      fill: ${(props) => props.theme.colors.background.tertiary} !important;
    }
  }
  :not(:disabled):focus,
  :not(:disabled):hover {
    path,
    g {
      fill: ${(props) => props.theme.colors.brand.medium} !important;
    }
  }
`

const Actions = styled.div`
  margin: ${(props) => props.theme.grid.unit * 4}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface Props {
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  modelMap: Map<string, Model>
  insertBibliographyNode: (item: Build<BibliographyItem>) => void
  importItems: (items: BibliographyItem[]) => Promise<BibliographyItem[]>
  handleCancel: () => void
  handleCite: (items: BibliographyItem[], query?: string) => Promise<void>
  handleClose: () => void
  handleRemove: (id: string) => void
  items: BibliographyItem[]
  projectID: string
  scheduleUpdate: () => void
  selectedText: string
  citation: Citation
  updateCitation: (data: Partial<Citation>) => Promise<void>
  setComment: (comment: CommentAnnotation) => void
  updatePopper: () => void
  canEdit: boolean
}

const CitationEditor: React.FC<Props> = ({
  items,
  modelMap: initModelMap,
  saveModel,
  deleteModel,
  handleCancel,
  handleCite,
  handleClose,
  handleRemove,
  selectedText,
  setComment,
  importItems,
  insertBibliographyNode,
  citation,
  updatePopper,
  canEdit,
}) => {
  const [searching, setSearching] = useState(false)
  const [modelMap, setModelMap] = useState(initModelMap)

  const saveCallback = useCallback(
    async (item) => {
      await saveModel({ ...item, objectType: ObjectTypes.BibliographyItem })
      setModelMap(
        new Map([
          ...modelMap,
          [item._id, { ...item, objectType: ObjectTypes.BibliographyItem }],
        ])
      )
      updatePopper()
    },
    [modelMap, saveModel, updatePopper]
  )

  const [showEditModel, setShowEditModel] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BibliographyItem>()
  const referenceIdRef = useRef<string>('')

  const onCitationEditClick = useCallback(
    (e) => {
      const itemId = e.currentTarget.value
      const reference = modelMap.get(itemId) as BibliographyItem
      setSelectedItem(reference)
      setShowEditModel(true)
      referenceIdRef.current = reference._id
    },
    [modelMap]
  )

  const deleteReferenceCallback = useCallback(async () => {
    if (selectedItem) {
      await deleteModel(selectedItem._id)
      modelMap.delete(selectedItem._id)
      setModelMap(new Map([...modelMap]))
      setSelectedItem(modelMap.get(referenceIdRef.current) as BibliographyItem)
    }
  }, [selectedItem, modelMap, deleteModel, referenceIdRef])

  const [deleteDialog, setDeleteDialog] = useState<{
    show: boolean
    id?: string
  }>({ show: false })

  const addCitationCallback = useCallback(async () => {
    const item = buildBibliographyItem({
      title: 'Untitled',
      type: 'article-journal',
    })
    setSearching(false)
    setSelectedItem(item as BibliographyItem)
    setShowEditModel(true)
    insertBibliographyNode(item)
    setModelMap(
      new Map([...modelMap, [item._id, { ...item } as BibliographyItem]])
    )
  }, [insertBibliographyNode, modelMap])

  const addCommentCallback = useCallback(
    () => setComment(buildComment(citation._id) as CommentAnnotation),
    [citation._id, setComment]
  )

  const bibliographyItems = useMemo(() => {
    const citedReferencesSet = new Set(items.map((item) => item._id))
    return new Map(
      getModelsByType<BibliographyItem>(modelMap, ObjectTypes.BibliographyItem)
        .filter((model) => !citedReferencesSet.has(model._id))
        .map((model) => [model._id, model])
    )
  }, [items, modelMap])

  if (searching) {
    return (
      <CitationSearch
        query={selectedText}
        bibliographyItems={bibliographyItems}
        importItems={importItems}
        handleCite={handleCite}
        addCitation={addCitationCallback}
        handleCancel={() => setSearching(false)}
      />
    )
  }

  if (!items.length) {
    return (
      <div>
        <CitationSearch
          query={selectedText}
          bibliographyItems={bibliographyItems}
          importItems={importItems}
          handleCite={handleCite}
          addCitation={addCitationCallback}
          handleCancel={handleCancel}
        />
        <CitationModel
          editCitation={showEditModel}
          modelMap={modelMap}
          saveCallback={saveCallback}
          selectedItem={selectedItem}
          deleteCallback={deleteReferenceCallback}
          setSelectedItem={setSelectedItem}
          setShowEditModel={setShowEditModel}
        />
      </div>
    )
  }
  return (
    <div>
      <Dialog
        isOpen={deleteDialog.show}
        category={Category.confirmation}
        header="Remove cited item"
        message="Are you sure you want to remove this cited item? It will still exist in the reference list."
        actions={{
          secondary: {
            action: () => {
              if (deleteDialog.id) {
                handleRemove(deleteDialog.id)
                setDeleteDialog({ show: false })
              }
            },
            title: 'Remove',
          },
          primary: {
            action: () => setDeleteDialog({ show: false }),
            title: 'Cancel',
          },
        }}
      />
      <CitedItems>
        {items.map((item) => (
          <CitedItem
            key={item._id}
            style={{
              color:
                item.title === '[missing library item]' ? 'red' : 'inherit',
            }}
          >
            <CitedItemTitle value={item.title || 'Untitled'} />

            <CitedItemActionLine>
              <CitedItemMetadata>
                {shortLibraryItemMetadata(item)}
              </CitedItemMetadata>

              <CitedItemActions>
                <EditCitationButton
                  value={item._id}
                  onClick={onCitationEditClick}
                  disabled={!canEdit}
                >
                  <AnnotationEdit color={'#6E6E6E'} />
                </EditCitationButton>
                <ActionButton
                  disabled={!canEdit}
                  onClick={() => setDeleteDialog({ show: true, id: item._id })}
                >
                  <CloseIconDark className={'remove-icon'} />
                </ActionButton>
              </CitedItemActions>
            </CitedItemActionLine>
          </CitedItem>
        ))}
      </CitedItems>
      <CitationModel
        editCitation={showEditModel}
        modelMap={modelMap}
        saveCallback={saveCallback}
        selectedItem={selectedItem}
        deleteCallback={deleteReferenceCallback}
        setSelectedItem={setSelectedItem}
        setShowEditModel={setShowEditModel}
      />
      <Actions>
        <IconTextButton onClick={addCommentCallback}>
          <AddComment />
          <AddCommentButtonText>Add Comment</AddCommentButtonText>
        </IconTextButton>

        <ButtonGroup>
          <SecondaryButton onClick={() => handleClose()}>Done</SecondaryButton>
          <PrimaryButton disabled={!canEdit} onClick={() => setSearching(true)}>
            Add Citation
          </PrimaryButton>
        </ButtonGroup>
      </Actions>
    </div>
  )
}

export default CitationEditor

const EditCitationButton = styled(ActionButton)`
  margin-right: ${(props) => props.theme.grid.unit * 3}px;
`

const AddCommentButtonText = styled.div`
  display: contents;
  font-family: ${(props) => props.theme.font.family.sans};
  font-weight: ${(props) => props.theme.font.weight.normal};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.primary};
`
