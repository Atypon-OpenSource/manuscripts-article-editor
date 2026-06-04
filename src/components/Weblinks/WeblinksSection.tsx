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
  findNodeByID,
  getSupplementCaptionTitle,
  insertSupplementWeblink,
  NodeWeblink,
  updateSupplementWeblink,
} from '@manuscripts/body-editor'
import { FileAttachment } from '@manuscripts/body-editor'
import {
  Category,
  Dialog,
  ExpandableSection,
  WebLinkIcon,
  SecondaryButton,
} from '@manuscripts/style-guide'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { FileContainer } from '../FileManager/FileContainer'
import { FileName } from '../FileManager/FileName'
import { WeblinkActions } from './WeblinkActions'
import { WeblinkFormValues, WeblinkModal } from './WeblinkModal'

export type WeblinksSectionProps = {
  weblinks: NodeWeblink[]
}

const AddButton = styled(SecondaryButton)`
  margin: 8px 16px;
`

const toWeblinkFile = (weblink: NodeWeblink): FileAttachment => ({
  id: weblink.url,
  name: weblink.url,
})

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
    insertSupplementWeblink(values.url, '', view)
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
    const existingTitle =
      (editingWeblink?.node.attrs as { title?: string }).title ?? ''
    updateSupplementWeblink(match.pos, values.url, existingTitle, view)
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

  return (
    <div data-cy="weblinks-section">
      <ExpandableSection title="Weblinks" data-cy="weblinks-section-expandable">
      {can?.editArticle && (
          <AddButton
            data-cy="add-weblink-button"
            onClick={() => setIsAddOpen(true)}
          >
            + Add link
          </AddButton>
        )}
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
      </ExpandableSection>

      <WeblinkModal
        isOpen={isAddOpen}
        header="Add weblink"
        initialUrl=""
        onClose={() => setIsAddOpen(false)}
        onSave={handleAdd}
      />

      <WeblinkModal
        key={editingWeblink?.node.attrs.id ?? 'edit'}
        isOpen={editingWeblink !== null}
        header="Edit weblink"
        initialUrl={editingWeblink?.url ?? ''}
        onClose={() => setEditingWeblink(null)}
        onSave={handleEdit}
      />

      <Dialog
        isOpen={deleteTarget !== null}
        category={Category.confirmation}
        header='Delete weblink'     
        message={
          <>
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

type WeblinkEntryProps = {
  weblink: NodeWeblink
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  canEdit: boolean
}

const WeblinkEntry = ({
  weblink,
  onClick,
  onEdit,
  onDelete,
  canEdit,
}: WeblinkEntryProps) => {
  const file = toWeblinkFile(weblink)
  const captionTitle = getSupplementCaptionTitle(weblink.node)

  return (
    <WeblinkContainer
      data-cy="weblink-container"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.currentTarget === document.activeElement) {
          onClick()
        }
      }}
    >
      <WeblinkInfo>
        <FileName file={file} icon={WebLinkIcon} maxBaseNameLength={28} />
        {captionTitle ? (
          <WeblinkCaptionTitle data-cy="weblink-caption-title">
            {captionTitle}
          </WeblinkCaptionTitle>
        ) : null}
      </WeblinkInfo>
      {canEdit && <WeblinkActions onEdit={onEdit} onDelete={onDelete} />}
    </WeblinkContainer>
  )
}

const WeblinkContainer = styled(FileContainer)`
  padding: 8px 16px;
  height: auto;
`

const WeblinkInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 2px;
`

const WeblinkCaptionTitle = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.normal};
  color: ${(props) => props.theme.colors.text.greyMuted};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`