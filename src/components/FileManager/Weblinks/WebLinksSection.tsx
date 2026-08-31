/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2026 Atypon Systems LLC. All Rights Reserved.
 */

import {
  deleteSupplementAtPos,
  findNodeByID,
  insertSupplementWeblink,
  NodeWeblink,
  updateSupplementWeblink,
} from '@manuscripts/body-editor'

import {
  Category,
  Dialog,
  ExpandableSection,
} from '@manuscripts/style-guide'
import { Button } from '@manuscripts/style-guide/mui'
import { NodeSelection } from 'prosemirror-state'
import React, { useState } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../../lib/capabilities'
import { useStore } from '../../../store'

import { WeblinkFormValues, WeblinkModal, WeblinkModalMode } from './WeblinkModal'
import { WeblinkEntry } from './WeblinkEntry'

export type WebLinksSectionProps = {
  weblinks: NodeWeblink[]
}

export const WebLinksSection: React.FC<WebLinksSectionProps> = ({
  weblinks,
}) => {
  const [{ view }] = useStore((s) => ({
    view: s.view,
  }))
  const can = usePermissions()

  const [modalState, setModalState] = useState<{
    mode: WeblinkModalMode
    weblink: NodeWeblink | null
  } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NodeWeblink | null>(null)

  if (!view) {
    return null
  }

  const editingWeblink =
    modalState?.mode === WeblinkModalMode.Edit ? modalState.weblink : null

  const handleClick = (weblink: NodeWeblink) => {
    const tr = view.state.tr
    tr.setSelection(NodeSelection.create(view.state.doc, weblink.pos))
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleAdd = (values: WeblinkFormValues) => {
    insertSupplementWeblink(values.url, '', view)
    setModalState(null)
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
    setModalState(null)
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
          <Button
            variant="secondary"
            data-cy="add-weblink-button"
            onClick={() => setModalState({ mode: WeblinkModalMode.Add, weblink: null })}
            style={{ margin: '8px 16px' }}
          >
            + Add link
          </Button>
        )}
        {weblinks.map((weblink) => (
          <WeblinkEntry
            key={weblink.node.attrs.id}
            weblink={weblink}
            onClick={() => handleClick(weblink)}
            onEdit={() => setModalState({ mode: WeblinkModalMode.Edit, weblink })}
            onDelete={() => setDeleteTarget(weblink)}
            canEdit={Boolean(can?.editArticle)}
          />
        ))}
      </ExpandableSection>

      <WeblinkModal
        key={modalState?.weblink?.node.attrs.id ?? modalState?.mode ?? 'closed'}
        isOpen={modalState !== null}
        mode={modalState?.mode ?? WeblinkModalMode.Add}
        initialUrl={modalState?.weblink?.node.attrs.href}
        onClose={() => setModalState(null)}
        onSave={
          modalState?.mode === WeblinkModalMode.Edit ? handleEdit : handleAdd
        }
      />

      <Dialog
        isOpen={deleteTarget !== null}
        category={Category.warning}
        header="Delete weblink"
        message={
          <>
            Are you sure you want to delete the Weblink?
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


