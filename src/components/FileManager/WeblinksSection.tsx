/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import {
  deleteSupplementAtPos,
  findCrossReferencesToId,
  findNodeByID,
  insertSupplementWeblink,
  NodeWeblink,
  updateSupplementWeblink,
} from '@manuscripts/body-editor'
import {
  AttentionOrangeIcon,
  Category,
  Dialog,
  DotsIcon,
  DropdownContainer,
  ExpandableSection,
  LinkIcon,
  SecondaryButton,
  useDropdown,
} from '@manuscripts/style-guide'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { FileAction, FileActionDropdownList } from './FileActions'
import { FileContainer } from './FileContainer'
import { WeblinkFormValues, WeblinkModal } from './WeblinkModal'

export type WeblinksSectionProps = {
  weblinks: NodeWeblink[]
}

const AddButton = styled(SecondaryButton)`
  width: calc(100% - 32px);
  margin: 8px 16px;
`

const WeblinkLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 8px;
`

const WeblinkIcon = styled.span`
  display: flex;
  align-items: center;
  min-width: 20px;
`

const ActionsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`

export const WeblinksSection: React.FC<WeblinksSectionProps> = ({
  weblinks,
}) => {
  const [{ view }] = useStore((s) => ({
    view: s.view,
  }))
  const can = usePermissions()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingWeblink, setEditingWeblink] = useState<NodeWeblink | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NodeWeblink | null>(null)

  if (!view) {
    return null
  }

  const handleClick = (weblink: NodeWeblink) => {
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, weblink.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleAdd = (values: WeblinkFormValues) => {
    insertSupplementWeblink(values.url, values.title, view)
    setIsAddOpen(false)
  }

  const handleEdit = (values: WeblinkFormValues) => {
    const id = editingWeblink?.node.attrs.id
    if (!id) {
      return
    }
    const match = findNodeByID(view.state.doc, id)
    if (!match) {
      return
    }
    updateSupplementWeblink(match.pos, values.url, values.title, view)
    setEditingWeblink(null)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) {
      return
    }
    const from = deleteTarget.pos
    const to = from + deleteTarget.node.nodeSize
    const { from: deleteFrom, to: deleteTo } = deleteSupplementAtPos(
      view.state.doc,
      from,
      to
    )
    const tr = view.state.tr.delete(deleteFrom, deleteTo)
    view.dispatch(tr)
    setDeleteTarget(null)
  }

  const crossRefCount = deleteTarget
    ? findCrossReferencesToId(view.state.doc, deleteTarget.node.attrs.id).length
    : 0

  return (
    <div data-cy="weblinks-section">
      
      <ExpandableSection title="Weblinks">
        {weblinks.map((weblink) => (
          <WeblinkEntry
            key={weblink.node.attrs.id}
            weblink={weblink}
            onClick={() => handleClick(weblink)}
            onEdit={() => setEditingWeblink(weblink)}
            onDelete={() => setDeleteTarget(weblink)}
            canEdit={Boolean(can?.editArticle)}
          />
        ))}
        {can?.editArticle && (
        <AddButton
          data-cy="add-weblink-button"
          onClick={() => setIsAddOpen(true)}
        >
          Add weblink
        </AddButton>
      )}
      </ExpandableSection>

      <WeblinkModal
        isOpen={isAddOpen}
        header="Add weblink"
        initialValues={{ url: '', title: '' }}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAdd}
      />

      <WeblinkModal
        key={editingWeblink?.node.attrs.id ?? 'edit'}
        isOpen={editingWeblink !== null}
        header="Edit weblink"
        initialValues={{
          url: editingWeblink?.url ?? '',
          title: editingWeblink?.title ?? '',
        }}
        onClose={() => setEditingWeblink(null)}
        onSave={handleEdit}
      />

      <Dialog
        isOpen={deleteTarget !== null}
        category={Category.confirmation}
        header={
          crossRefCount > 0 ? (
            <>
              <AttentionOrangeIcon />
              Delete weblink
            </>
          ) : (
            'Delete weblink'
          )
        }
        message={
          <>
            {crossRefCount > 0 && (
              <>
                This supplement is referenced by {crossRefCount} cross-reference
                {crossRefCount === 1 ? '' : 's'} in the manuscript. Deleting it
                may break those references.
                <br />
                <br />
              </>
            )}
            Are you sure you want to delete &ldquo;{deleteTarget?.url}&rdquo;?
          </>
        }
        actions={{
          primary: {
            action: handleDeleteConfirm,
            title: 'Delete',
          },
          secondary: {
            action: () => setDeleteTarget(null),
            title: 'Cancel',
          },
        }}
      />
    </div>
  )
}

const WeblinkEntry: React.FC<{
  weblink: NodeWeblink
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  canEdit: boolean
}> = ({ weblink, onClick, onEdit, onDelete, canEdit }) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()

  const closeDropdown = () => {
    if (isOpen) {
      toggleOpen()
    }
  }

  return (
    <FileContainer
      data-cy="weblink-container"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.currentTarget === document.activeElement) {
          onClick()
        }
      }}
    >
      <WeblinkIcon>
        <LinkIcon />
      </WeblinkIcon>
      <WeblinkLabel>{weblink.url}</WeblinkLabel>
      {canEdit && (
        <DropdownContainer ref={wrapperRef}>
          <ActionsButton
            data-cy="weblink-actions"
            onClick={(e) => {
              e.stopPropagation()
              toggleOpen()
            }}
            aria-label="Weblink actions"
          >
            <DotsIcon />
          </ActionsButton>
          {isOpen && (
            <FileActionDropdownList
              data-cy="weblink-actions-dropdown"
              direction="right"
              width={120}
              top={5}
              onClick={(e) => e.stopPropagation()}
            >
              <FileAction
                data-cy="weblink-edit"
                onClick={(e) => {
                  e.stopPropagation()
                  closeDropdown()
                  onEdit()
                }}
              >
                Edit
              </FileAction>
              <FileAction
                data-cy="weblink-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  closeDropdown()
                  onDelete()
                }}
              >
                Delete
              </FileAction>
            </FileActionDropdownList>
          )}
        </DropdownContainer>
      )}
    </FileContainer>
  )
}
