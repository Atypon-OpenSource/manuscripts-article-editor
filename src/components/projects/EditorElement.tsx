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
  FileAttachment,
  findParentElement,
  getMatchingChild,
  getMediaTypeInfo,
  useEditor,
} from '@manuscripts/body-editor'
import { Category, Dialog } from '@manuscripts/style-guide'
import {
  EmbedNode,
  FigureNode,
  generateNodeID,
  ImageElementNode,
  ManuscriptEditorView,
  ManuscriptResolvedPos,
  schema,
} from '@manuscripts/transform'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { NodeSelection, Transaction } from 'prosemirror-state'
import { findParentNodeClosestToPos, flatten } from 'prosemirror-utils'
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

import { useConnectEditor } from '../../hooks/use-connect-editor'
import { useWatchTitle } from '../../hooks/use-watch-title'
import { setNodeAttrs } from '../../lib/node-attrs'
import { insertMediaOrFigure } from '../../lib/utils'
import { useStore } from '../../store'
import { SpriteMap } from '../track-changes/suggestion-list/Icons'

const EditorElement: React.FC = () => {
  const [error, setError] = useState('')
  const [{ editor, isViewingMode }] = useStore((store) => ({
    editor: store.editor,
    isViewingMode: store.isViewingMode,
  }))

  const { onRender, view, dispatch } = useConnectEditor()
  useWatchTitle()

  const [, dropRef] = useDrop({
    accept: 'file',
    drop: async (item, monitor) => {
      const offset = monitor.getSourceClientOffset()
      if (offset && offset.x && offset.y && view) {
        const docPos = view.posAtCoords({ left: offset.x, top: offset.y })
        // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
        const file = item.file as FileAttachment
        if (!file || !docPos || !docPos.pos) {
          return false
        }

        const resolvedPos = view.state.doc.resolve(docPos.pos)
        const mediaInfo = getMediaTypeInfo(file.name)
        const attrs: Record<string, unknown> = {
          src: file.id,
        }

        let targetNode = view.state.doc.nodeAt(docPos.pos) || resolvedPos.parent
        let mediaNodeWithPos
        if (
          targetNode.type === schema.nodes.figcaption ||
          targetNode.type === schema.nodes.caption ||
          targetNode.type === schema.nodes.caption_title
        ) {
          mediaNodeWithPos = findParentNodeClosestToPos(
            resolvedPos,
            (node) => node.type === schema.nodes.embed
          )
          if (mediaNodeWithPos) {
            targetNode = mediaNodeWithPos.node
          }
        }

        switch (targetNode.type) {
          case schema.nodes.image_element: {
            const attrs: Record<string, unknown> = {
              extLink: file.id,
            }
            const imageElement = targetNode as ImageElementNode
            setNodeAttrs(view.state, dispatch, imageElement.attrs.id, attrs)
            break
          }
          case schema.nodes.figure: {
            const figure = targetNode as FigureNode
            setNodeAttrs(view.state, dispatch, figure.attrs.id, attrs)
            break
          }
          case schema.nodes.embed: {
            const media = targetNode as EmbedNode
            setNodeAttrs(view.state, dispatch, media.attrs.id, {
              href: file.id,
              mimetype: mediaInfo.mimetype,
              mimeSubtype: mediaInfo.mimeSubtype,
            })
            break
          }
          case schema.nodes.figcaption:
          case schema.nodes.caption:
          case schema.nodes.caption_title: {
            if (mediaNodeWithPos) {
              const media = mediaNodeWithPos.node as EmbedNode
              setNodeAttrs(view.state, dispatch, media.attrs.id, {
                href: file.id,
                mimetype: mediaInfo.mimetype,
                mimeSubtype: mediaInfo.mimeSubtype,
              })
            } else {
              addFigureAtFigCaptionPosition(editor, resolvedPos, attrs, file)
            }
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
            const tr = view.state.tr
            tr.setSelection(NodeSelection.near(resolvedPos))
            view.focus()
            dispatch(tr)
            // after dispatch is called - the view.state changes and becomes the new state of the editor so exactly the view.state has to be used to make changes on the actual state

            insertMediaOrFigure(file, view, dispatch)
          }
        }
        return true
      }
      return false
    },
  })

  const drop = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef(node)
    },
    [dropRef]
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
      <>
        <SpriteMap color="#353535" />
        {
          /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions  */
          // Changing the `key` forces React to recreate the DOM node,
          // which triggers a fresh ProseMirror EditorView instance.
          // This is necessary because EditorView does not pick up props changes
          // (like `editable`, `nodeViews`, or `getCapabilities`) once initialized.
        }
        <div id="editorDropzone" ref={drop}>
          <div
            id="editor"
            key={`editor-mode-${isViewingMode ? 'view' : 'edit'}`}
            ref={onRender}
          ></div>
        </div>
      </>
    </>
  )
}

/**
 *   Will add figure at the end of figureElement if there is no figure is empty,
 *   if we have one of the figure empty form image will assign the new image for it
 */
const addFigureAtFigCaptionPosition = (
  editor: ReturnType<typeof useEditor>,
  resolvePos: ManuscriptResolvedPos,
  attrs: Record<string, unknown>,
  file: FileAttachment
) => {
  const { view, dispatch } = editor
  if (!view) {
    return
  }

  const nodeWithPos = findParentNodeClosestToPos(
    resolvePos,
    (node) => node.type === schema.nodes.figure_element
  )

  if (nodeWithPos) {
    const figures = flatten(nodeWithPos.node).filter(
      ({ node }) => node.type === schema.nodes.figure
    )
    const emptyFigure = figures.find(({ node }) =>
      isEmptyFigureNode(node as FigureNode)
    )

    if (emptyFigure) {
      setNodeAttrs(view.state, dispatch, emptyFigure.node.attrs.id, attrs)
    } else {
      const lastChild = figures.at(-1)
      addNewFigure(
        view,
        dispatch,
        attrs,
        (lastChild &&
          nodeWithPos.pos + lastChild.pos + lastChild.node.nodeSize + 1) ||
          nodeWithPos.pos + 1
      )
    }
  } else {
    const transaction = view.state.tr.setSelection(
      NodeSelection.near(resolvePos)
    )
    view.focus()
    dispatch(transaction)

    insertMediaOrFigure(file, view, dispatch)
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
  const figure = schema.nodes.figure.createAndFill({
    ...attrs,
    id: generateNodeID(schema.nodes.figure),
  }) as FigureNode
  const tr = view.state.tr.insert(pos, figure)
  dispatch(tr)
}

export default EditorElement
