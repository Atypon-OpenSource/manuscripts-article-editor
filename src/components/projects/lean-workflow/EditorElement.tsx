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
  addExternalFileRef,
  insertFileAsFigure,
  useEditor,
} from '@manuscripts/manuscript-editor'
import { Build, schema } from '@manuscripts/manuscript-transform'
import {
  ExternalFile,
  Figure,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import { commands } from '@manuscripts/track-changes'
import { NodeSelection } from 'prosemirror-state'
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'

import { useCommits } from '../../../hooks/use-commits'
import { setNodeAttrs } from '../../../lib/node-attrs'
import { SpriteMap } from '../../track/Icons'

interface Props {
  editor: ReturnType<typeof useEditor>
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  modelMap: Map<string, Model>
  changeAttachmentDesignation: (
    designation: string,
    name: string
  ) => Promise<any>
  accept: ReturnType<typeof useCommits>['accept']
  reject: ReturnType<typeof useCommits>['reject']
  doCommand: ReturnType<typeof useEditor>['doCommand']
}

const EditorElement: React.FC<Props> = ({
  editor,
  modelMap,
  accept,
  reject,
  changeAttachmentDesignation,
  doCommand,
}) => {
  const { onRender, view, dispatch } = editor
  const [error, setError] = useState('')

  const handleError = (e: any) => {
    console.log(e)
    setError(e)
  }

  const [, drop] = useDrop({
    accept: 'FileSectionItem',
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset()
      if (offset && offset.x && offset.y && view) {
        const docPos = view.posAtCoords({ left: offset.x, top: offset.y })
        // @ts-expect-error: Ignoring default type from the React DnD plugin. Seems to be unreachable
        const externalFile = item.externalFile as ExternalFile
        if (!externalFile || !docPos || !docPos.pos) {
          return
        }
        changeAttachmentDesignation('figure', externalFile.filename)
          .then((result) => {
            if (result?.data?.setAttachmentType === false) {
              return handleError('Store declined designation change')
            }
            const resolvedPos = view.state.doc.resolve(docPos.pos)
            if (resolvedPos.parent.type === schema.nodes.figure) {
              const figure = modelMap.get(resolvedPos.parent.attrs.id) as Figure
              // @ts-ignore
              figure.externalFileReferences = addExternalFileRef(
                figure.externalFileReferences,
                externalFile.publicUrl
              )
              setNodeAttrs(view.state, dispatch, figure._id, {
                src: externalFile.publicUrl,
                externalFileReferences: figure.externalFileReferences,
              })
            } else {
              const transaction = view.state.tr.setSelection(
                new NodeSelection(resolvedPos)
              )
              view.focus()
              dispatch(transaction)
              // after dispatch is called - the view.state changes and becomes the new state of the editor so exactly the view.state has to be used to make changes on the actual state
              insertFileAsFigure(externalFile, view.state, dispatch)
            }
          })
          .catch(handleError)
      }
    },
  })

  const handleEditorClick = useCallback(
    (e: React.MouseEvent) => {
      const button = e.target && (e.target as HTMLElement).closest('button')
      if (!button) {
        return
      }
      const action = button.getAttribute('data-action')
      const changeId = button.getAttribute('data-changeid')
      const uid = button.getAttribute('data-uid')
      if (!action) {
        return
      } else if (action === 'accept') {
        accept((corr) => corr.commitChangeID === changeId)
      } else if (action === 'reject') {
        reject((corr) => corr.commitChangeID === changeId)
      } else if (action === 'select-comment') {
        if (!uid) {
          return
        }
        doCommand(commands.focusAnnotation(uid))
      }
    },
    [accept, reject, doCommand]
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
export default EditorElement
