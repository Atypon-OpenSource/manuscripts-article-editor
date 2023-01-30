/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2021 Atypon Systems LLC. All Rights Reserved.
 */
import {
  findParentElement,
  getMatchingChild,
  insertFileAsFigure,
  useEditor,
} from '@manuscripts/body-editor'
import { Model, ObjectTypes, Supplement } from '@manuscripts/json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import {
  CHANGE_STATUS,
  trackCommands,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import {
  FigureElementNode,
  FigureNode,
  generateID,
  getModelsByType,
  ManuscriptEditorView,
  schema,
} from '@manuscripts/transform'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeSelection, Transaction } from 'prosemirror-state'
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

import { SubmissionAttachment } from '../../../lib/lean-workflow-gql'
import { setNodeAttrs } from '../../../lib/node-attrs'
import { useStore } from '../../../store'
import { SpriteMap } from '../../track-changes/suggestion-list/Icons'
import { useEditorStore } from '../../track-changes/useEditorStore'

interface Props {
  editor: ReturnType<typeof useEditor>
}

const EditorElement: React.FC<Props> = ({ editor }) => {
  const { onRender, view, dispatch } = editor
  const [error, setError] = useState('')
  const [{ modelMap, deleteModel }] = useStore((store) => ({
    modelMap: store.modelMap,
    deleteModel: store.deleteModel,
  }))
  const { execCmd, trackState } = useEditorStore()

  const [, drop] = useDrop({
    accept: 'FileSectionItem',
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset()
      if (offset && offset.x && offset.y && view) {
        const docPos = view.posAtCoords({ left: offset.x, top: offset.y })
        // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
        const attachment = item.externalFile as SubmissionAttachment
        if (!attachment || !docPos || !docPos.pos) {
          return
        }

        const resolvedPos = view.state.doc.resolve(docPos.pos)
        const attrs: Record<string, unknown> = {
          src: attachment.link,
        }

        switch (resolvedPos.parent.type) {
          case schema.nodes.figure: {
            const figure = resolvedPos.parent as FigureNode
            if (isEmptyFigureNode(figure)) {
              setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs)
            } else {
              addNewFigure(view, dispatch, attrs, resolvedPos.pos + 1)
            }
            return deleteSupplementFile(deleteModel, modelMap, attachment)
          }
          case schema.nodes.figcaption:
          case schema.nodes.caption:
          case schema.nodes.caption_title: {
            addFigureAtFigCaptionPosition(
              editor,
              resolvedPos.parent,
              resolvedPos.pos,
              attrs,
              new NodeSelection(resolvedPos),
              attachment
            )
            return deleteSupplementFile(deleteModel, modelMap, attachment)
          }
          case schema.nodes.figure_element: {
            addFigureAtFigureElementPosition(
              editor,
              resolvedPos.parent,
              resolvedPos.pos,
              attrs
            )
            return deleteSupplementFile(deleteModel, modelMap, attachment)
          }
          default: {
            const transaction = view.state.tr.setSelection(
              new NodeSelection(resolvedPos)
            )
            view.focus()
            dispatch(transaction)
            // after dispatch is called - the view.state changes and becomes the new state of the editor so exactly the view.state has to be used to make changes on the actual state
            insertFileAsFigure(attachment, view.state, dispatch)
            return deleteSupplementFile(deleteModel, modelMap, attachment)
          }
        }
      }
    },
  })

  const handleAcceptChange = useCallback(
    (c: TrackedChange) => {
      const ids = [c.id]
      if (c.type === 'node-change') {
        c.children.forEach((child) => {
          ids.push(child.id)
        })
      }
      execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.accepted, ids))
    },
    [execCmd]
  )
  const handleRejectChange = useCallback(
    (c: TrackedChange) => {
      const ids = [c.id]
      if (c.type === 'node-change') {
        c.children.forEach((child) => {
          ids.push(child.id)
        })
      }
      execCmd(trackCommands.setChangeStatuses(CHANGE_STATUS.rejected, ids))
    },
    [execCmd]
  )
  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      const button = e.target && (e.target as HTMLElement).closest('button')
      if (!button) {
        return
      }
      if (!trackState) {
        return
      }
      const { changeSet } = trackState

      const action = button.getAttribute('data-action')
      const changeId = button.getAttribute('data-changeid')

      if (action && changeId) {
        const change = changeSet.changes.find((c) => c.id == changeId)
        if (change) {
          if (action === 'accept') {
            handleAcceptChange(change)
          } else if (action === 'reject') {
            handleRejectChange(change)
          }
        }
      }
    },
    [handleAcceptChange, handleRejectChange, trackState]
  )

  return (
    <>
      {error && (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Designation change error'}
          message={'Unable to set this file to be a figure'}
          actions={{
            primary: {
              action: () => setError(''),
            },
          }}
        />
      )}
      <SpriteMap color="#353535" />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions  */}
      <div id="editorDropzone" ref={drop} onClick={handleEditorClick}>
        <div id="editor" ref={onRender}></div>
      </div>
    </>
  )
}

/**
 *   Will get figureElement node and position of figcaption.
 *   then check if the current figure empty to update it's external file.
 *   if not will add a new Figure above figcaption node
 */
const addFigureAtFigCaptionPosition = (
  editor: ReturnType<typeof useEditor>,
  node: ProsemirrorNode,
  pos: number,
  attrs: Record<string, unknown>,
  nodeSelection: NodeSelection,
  attachment: SubmissionAttachment
) => {
  const { view, dispatch } = editor
  if (!view) {
    return
  }

  const getFigureElementWithFigcaptionPos = () => {
    let figureElement, figcaptionPos
    if (
      node.type === schema.nodes.caption ||
      node.type === schema.nodes.caption_title
    ) {
      const figcaptionPos = findParentElement(
        NodeSelection.create(view.state.doc, pos)
      )?.start
      figureElement = figcaptionPos
        ? findParentElement(NodeSelection.create(view.state.doc, figcaptionPos))
        : undefined
    } else {
      figureElement = findParentElement(
        NodeSelection.create(view.state.doc, pos)
      )
    }
    if (
      !figureElement ||
      figureElement?.node.type !== schema.nodes.figure_element
    ) {
      return undefined
    }

    figureElement.node.forEach((node, pos) => {
      if (node.type === schema.nodes.figcaption) {
        figcaptionPos = pos
      }
    })
    return figcaptionPos
      ? {
          node: figureElement.node as FigureElementNode,
          pos: figureElement.pos + figcaptionPos,
        }
      : undefined
  }

  const nodeWithPos = getFigureElementWithFigcaptionPos()
  if (nodeWithPos) {
    const figure = getMatchingChild(
      nodeWithPos.node,
      (node) => node.type === node.type.schema.nodes.figure
    ) as FigureNode
    if (isEmptyFigureNode(figure)) {
      setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs)
    } else {
      addNewFigure(view, dispatch, attrs, nodeWithPos.pos)
    }
  } else {
    const transaction = view.state.tr.setSelection(nodeSelection)
    view.focus()
    dispatch(transaction)
    insertFileAsFigure(attachment, view.state, dispatch)
  }
}

/**
 *  Will update figure external file if it's empty,
 *  or add a new figure to the figure_element
 */
const addFigureAtFigureElementPosition = (
  editor: ReturnType<typeof useEditor>,
  node: ProsemirrorNode,
  pos: number,
  attrs: Record<string, unknown>
) => {
  const { view, dispatch } = editor
  if (!view) {
    return
  }

  let figcaptionPos = 0,
    figureElementPos = 0
  node.descendants((node, nodePos) => {
    if (node.type === schema.nodes.figcaption) {
      figcaptionPos = nodePos
      figureElementPos =
        findParentElement(NodeSelection.create(view.state.doc, pos))?.start || 0
    }
  })

  const figure = getMatchingChild(
    node,
    (node) => node.type === node.type.schema.nodes.figure
  ) as FigureNode
  if (isEmptyFigureNode(figure)) {
    setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs)
  } else {
    addNewFigure(view, dispatch, attrs, figcaptionPos + figureElementPos)
  }
}

const isEmptyFigureNode = (figure: FigureNode) =>
  figure.attrs.src.trim().length < 1

const addNewFigure = (
  view: ManuscriptEditorView,
  dispatch: (tr: Transaction) => void,
  attrs: Record<string, unknown>,
  pos: number
) => {
  const figure = view.state.schema.nodes.figure.createAndFill({
    ...attrs,
    id: generateID(ObjectTypes.Figure),
  }) as FigureNode
  const tr = view.state.tr.insert(pos, figure)
  dispatch(tr)
}

const deleteSupplementFile = (
  deleteModel: (id: string) => Promise<string>,
  modelMap: Map<string, Model>,
  attachment: SubmissionAttachment
) => {
  const supplement = getModelsByType<Supplement>(
    modelMap,
    ObjectTypes.Supplement
  ).find((object) => object.href === `attachment:${attachment.id}`)
  if (supplement) {
    return deleteModel(supplement._id)
  }
}

export default EditorElement
