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
import { ObjectTypes } from '@manuscripts/json-schema'
import { Category, Dialog, FileAttachment } from '@manuscripts/style-guide'
import {
  CHANGE_STATUS,
  ChangeSet,
  trackCommands,
  TrackedChange,
} from '@manuscripts/track-changes-plugin'
import {
  FigureElementNode,
  FigureNode,
  generateID,
  ManuscriptEditorView,
  schema,
} from '@manuscripts/transform'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeSelection, Transaction } from 'prosemirror-state'
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

import { useExecCmd } from '../../hooks/use-track-attrs-popper'
import { setNodeAttrs } from '../../lib/node-attrs'
import { useStore } from '../../store'
import { SpriteMap } from '../track-changes/suggestion-list/Icons'
import { useWindowUnloadEffect } from '../../hooks/use-window-unload-effect'

interface Props {
  editor: ReturnType<typeof useEditor>
}

const EditorElement: React.FC<Props> = ({ editor }) => {
  const { onRender, view, dispatch } = editor
  const [error, setError] = useState('')
  const [{ deleteModel, trackState }] = useStore((store) => ({
    deleteModel: store.deleteModel,
    trackState: store.trackState,
  }))

  const execCmd = useExecCmd()

  useWindowUnloadEffect()

  const [, drop] = useDrop({
    accept: 'file',
    drop: async (item, monitor) => {
      const offset = monitor.getSourceClientOffset()
      if (offset && offset.x && offset.y && view) {
        const docPos = view.posAtCoords({ left: offset.x, top: offset.y })
        // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
        const file = item.file as FileAttachment
        // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
        const model = item.model

        if (!file || !docPos || !docPos.pos) {
          return
        }

        const resolvedPos = view.state.doc.resolve(docPos.pos)
        const attrs: Record<string, unknown> = {
          src: file.id,
        }

        switch (resolvedPos.parent.type) {
          case schema.nodes.figure: {
            const figure = resolvedPos.parent as FigureNode
            if (isEmptyFigureNode(figure)) {
              setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs)
            } else {
              addNewFigure(view, dispatch, attrs, resolvedPos.pos + 1)
            }
            break
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
              file
            )
            break
          }
          case schema.nodes.figure_element: {
            addFigureAtFigureElementPosition(
              editor,
              resolvedPos.parent,
              resolvedPos.pos,
              attrs
            )
            break
          }
          default: {
            const transaction = view.state.tr.setSelection(
              new NodeSelection(resolvedPos)
            )
            view.focus()
            dispatch(transaction)
            // after dispatch is called - the view.state changes and becomes the new state of the editor so exactly the view.state has to be used to make changes on the actual state
            insertFileAsFigure(file, view.state, dispatch)
          }
        }
        if (model) {
          await deleteModel(model.id)
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

  const findChange = (changeSet: ChangeSet, changeId: string) => {
    const change = changeSet.changes.find((c) => c.id == changeId)
    if (change) {
      const fullChange = changeSet[change.dataTracked.status].find(
        (c) => c.id == changeId
      )
      return fullChange
    }
    return change
  }

  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      const { view, dispatch } = editor
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
        const change = findChange(changeSet, changeId)
        if (change) {
          if (action === 'accept') {
            handleAcceptChange(change)
          } else if (action === 'reject') {
            handleRejectChange(change)
          }
          if (
            change.type === 'node-change' &&
            change.nodeType === 'keyword' &&
            view &&
            dispatch
          ) {
            dispatch(view.state.tr.setMeta('keywordsUpdated', true))
          }
        }
      }
    },
    [handleAcceptChange, handleRejectChange, trackState, editor]
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
  file: FileAttachment
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
    insertFileAsFigure(file, view.state, dispatch)
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

export default EditorElement
