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

import AnnotationRemove from '@manuscripts/assets/react/AnnotationRemove'
import { shortLibraryItemMetadata } from '@manuscripts/library'
import { Build, buildComment } from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Citation,
  CommentAnnotation,
} from '@manuscripts/manuscripts-json-schema'
import {
  AddComment,
  ButtonGroup,
  IconButton,
  IconTextButton,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React, { ChangeEvent, useCallback, useState } from 'react'
import styled from 'styled-components'

import { CitationProperties } from './CitationProperties'
import { CitationSearch } from './CitationSearch'

const CitedItem = styled.div`
  padding: ${(props) => props.theme.grid.unit * 4}px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.secondary};
  }
`

const CitedItemTitle = styled(Title)``

const CitedItemMetadata = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.light};
  margin-top: ${(props) => props.theme.grid.unit}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
})``

const Actions = styled.div`
  margin: ${(props) => props.theme.grid.unit * 4}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Options = styled.details`
  margin: ${(props) => props.theme.grid.unit * 4}px;
`

const OptionsSummary = styled.summary`
  cursor: pointer;

  &:focus {
    outline: 1px solid ${(props) => props.theme.colors.border.tertiary};
  }
`

interface Props {
  filterLibraryItems: (query: string) => Promise<BibliographyItem[]>
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
}

const CitationEditor: React.FC<Props> = ({
  items,
  handleCancel,
  handleCite,
  handleClose,
  handleRemove,
  selectedText,
  setCommentTarget,
  importItems,
  filterLibraryItems,
  citation,
  updateCitation,
}) => {
  // const [editing, setEditing] = useState<BibliographyItem>()
  const [searching, setSearching] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [properties, setProperties] = useState(citation)

  // if (editing) {
  //   return <div>TODO…</div>
  // }

  const saveAndClose = useCallback(() => {
    // TODO: if changed?
    updateCitation(properties)
      .then(() => handleClose())
      .catch((error) => {
        console.error(error)
      })
  }, [properties, handleClose, updateCitation])

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
        handleCancel={handleCancel}
      />
    )
  }

  return (
    <div>
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
                <ActionButton
                  onClick={() => {
                    if (confirm('Delete this cited item?')) {
                      handleRemove(item._id)
                    }
                  }}
                >
                  <AnnotationRemove />
                </ActionButton>
              </CitedItemActions>
            </CitedItemActionLine>
          </CitedItem>
        ))}
      </CitedItems>

      <Options
        open={optionsOpen}
        onToggle={(event: ChangeEvent<HTMLDetailsElement>) =>
          setOptionsOpen(event.target.open)
        }
      >
        <OptionsSummary>Options</OptionsSummary>

        <CitationProperties
          properties={properties}
          setProperties={setProperties}
        />
      </Options>

      <Actions>
        <IconTextButton onClick={addCommentCallback}>
          <AddComment />
          <AddCommentButtonText>Add Comment</AddCommentButtonText>
        </IconTextButton>

        <ButtonGroup>
          <SecondaryButton onClick={saveAndClose}>Done</SecondaryButton>
          <PrimaryButton onClick={() => setSearching(true)}>
            Add Citation
          </PrimaryButton>
        </ButtonGroup>
      </Actions>
    </div>
  )
}

export default CitationEditor

const AddCommentButtonText = styled.div`
  display: contents;
  font-family: ${(props) => props.theme.font.family.sans};
  font-weight: ${(props) => props.theme.font.weight.normal};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.primary};
`
