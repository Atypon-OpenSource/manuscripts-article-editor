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
import { shortLibraryItemMetadata } from '@manuscripts/library'
import {
  Build,
  buildBibliographyItem,
  buildComment
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Citation, CommentAnnotation,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
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
import React, { useCallback, useRef, useState } from 'react'
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
  :focus,
  :hover {
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
  filterLibraryItems: (query: string) => Promise<BibliographyItem[]>
  setLibraryItem: (item: BibliographyItem) => void
  removeLibraryItem: (id: string) => void
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  modelMap: Map<string, Model>
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
  setCommentTarget: (commentTarget: Build<CommentAnnotation>) => void
  updatePopper: () => void
}

const CitationEditor: React.FC<Props> = ({
  items,
  modelMap,
  saveModel,
  deleteModel,
  handleCancel,
  handleCite,
  handleClose,
  handleRemove,
  selectedText,
  setCommentTarget,
  importItems,
  filterLibraryItems,
  citation,
  removeLibraryItem,
  setLibraryItem,
  updatePopper,
}) => {
  const [searching, setSearching] = useState(false)

  const saveCallback = useCallback(
    async (item) => {
      await saveModel({ ...item, objectType: ObjectTypes.BibliographyItem })
      setLibraryItem(item)
      updatePopper()
    },
    [saveModel, setLibraryItem, updatePopper]
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
      removeLibraryItem(selectedItem._id)
      setSelectedItem(modelMap.get(referenceIdRef.current) as BibliographyItem)
    }
  }, [selectedItem, modelMap, deleteModel, removeLibraryItem, referenceIdRef])

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
    setLibraryItem(item as BibliographyItem)
    setSelectedItem(item as BibliographyItem)
    setShowEditModel(true)
    await saveModel({ ...item, objectType: ObjectTypes.BibliographyItem })
  }, [setLibraryItem, saveModel])

  const addCommentCallback = useCallback(
    () => setCommentTarget(buildComment(citation._id)),
    [citation._id, setCommentTarget]
  )

  if (searching) {
    return (
      <CitationSearch
        query={selectedText}
        filterLibraryItems={filterLibraryItems}
        importItems={importItems}
        handleCite={handleCite}
        addCitation={addCitationCallback}
        handleCancel={() => setSearching(false)}
      />
    )
  }

  if (!items.length) {
    return (
      <CitationSearch
        query={selectedText}
        filterLibraryItems={filterLibraryItems}
        importItems={importItems}
        handleCite={handleCite}
        addCitation={addCitationCallback}
        handleCancel={handleCancel}
      />
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
                >
                  <AnnotationEdit color={'#6E6E6E'} />
                </EditCitationButton>
                <ActionButton
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
        getReferences={filterLibraryItems}
      />

      <Actions>
        <IconTextButton onClick={addCommentCallback}>
          <AddComment />
          <AddCommentButtonText>Add Comment</AddCommentButtonText>
        </IconTextButton>

        <ButtonGroup>
          <SecondaryButton onClick={() => handleClose()}>Done</SecondaryButton>
          <PrimaryButton onClick={() => setSearching(true)}>
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
