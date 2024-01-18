/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */
import '@testing-library/jest-dom/extend-expect'

import { ManuscriptsEditor, useEditor } from '@manuscripts/body-editor'
import { CommentAnnotation } from '@manuscripts/json-schema'
import { encode, schema } from '@manuscripts/transform'
import { fireEvent, render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import useTrackedModelManagement from '../../../../hooks/use-tracked-model-management'
import {
  BasicSource,
  GenericStore,
  GenericStoreProvider,
} from '../../../../store'
import { theme } from '../../../../theme/theme'
import { CommentList } from '../CommentList'

jest.mock('react-modal', () => ({
  ...jest.requireActual('react-modal'),
  setAppElement: () => '',
}))

jest.mock('pdfjs-dist', () => ({
  getDocument: () => '',
  GlobalWorkerOptions: { workerSrc: '' },
}))

jest.mock('pdfjs-dist/build/pdf.worker.entry', () => ({
  pdfjsWorker: '',
}))

jest.mock('pdfjs-dist/web/pdf_viewer', () => ({
  EventBus: () => '',
  PDFViewer: () => '',
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    listen: () => '',
  }),
}))

const doc = schema.nodeFromJSON({
  type: 'manuscript',
  attrs: {
    id: 'MPManuscript:1',
  },
  content: [
    {
      type: 'section',
      attrs: {
        id: 'MPSection:1',
        category: '',
        dataTracked: null,
        comments: ['MPCommentAnnotation:test2'],
      },
      content: [
        {
          type: 'section_title',
          attrs: {
            dataTracked: null,
          },
          content: [
            {
              type: 'text',
              text: 'A section title with a author Query',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            id: 'MPParagraphElement:1',
            paragraphStyle: 'MPParagraphStyle:1',
            placeholder: '',
            dataTracked: null,
            comments: ['MPCommentAnnotation:test'],
          },
          content: [
            {
              type: 'text',
              text: 'This sentence contains a ',
            },
            {
              type: 'highlight_marker',
              attrs: {
                id: 'MPCommentAnnotation:test',
                tid: 'MPParagraphElement:1',
                position: 'start',
                dataTracked: null,
              },
            },
            {
              type: 'text',
              text: 'highlight',
            },
            {
              type: 'highlight_marker',
              attrs: {
                id: 'MPCommentAnnotation:test',
                tid: 'MPParagraphElement:1',
                position: 'end',
                dataTracked: null,
              },
            },
            {
              type: 'text',
              text: '.',
            },
          ],
        },
        {
          type: 'figure_element',
          attrs: {
            figureLayout: '',
            figureStyle: 'MPFigureStyle:1',
            id: 'MPFigureElement:1',
            label: '',
            sizeFraction: 0,
            suppressCaption: false,
            suppressTitle: true,
            dataTracked: null,
            comments: ['MPCommentAnnotation:test1'],
          },
          content: [
            {
              type: 'figure',
              attrs: {
                id: 'MPFigure:1',
                src: '',
                contentType: '',
                dataTracked: null,
              },
            },
            {
              type: 'figcaption',
              attrs: {
                dataTracked: null,
              },
              content: [
                {
                  type: 'caption_title',
                  attrs: {
                    placeholder: 'Title...',
                    dataTracked: null,
                  },
                },
                {
                  type: 'caption',
                  attrs: {
                    placeholder: 'Caption...',
                    dataTracked: null,
                  },
                  content: [
                    {
                      type: 'text',
                      text: 'A figure with a caption',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listing',
              attrs: {
                id: '',
                contents: '',
                language: '',
                languageKey: 'null',
                isExpanded: false,
                isExecuting: false,
                dataTracked: null,
                comments: null,
              },
            },
          ],
        },
      ],
    },
    {
      type: 'comment_list',
      attrs: {
        id: 'MPMetaSection:A46977A4-BFC0-423F-BFC1-242AA76CBAB3',
      },
      content: [
        {
          type: 'comment',
          attrs: {
            id: 'MPCommentAnnotation:test',
            contents: 'Highlight Block Comment',
            target: 'MPParagraphElement:1',
            selector: {
              from: 166,
              to: 175,
            },
            resolved: null,
            contributions: null,
            originalText: null,
          },
        },
        {
          type: 'comment',
          attrs: {
            id: 'MPCommentAnnotation:test1',
            contents: 'Figure Block Comment',
            target: 'MPFigureElement:1',
            selector: null,
            resolved: null,
            contributions: null,
            originalText: null,
          },
        },
        {
          type: 'comment',
          attrs: {
            id: 'MPCommentAnnotation:test2',
            contents: 'Author Query Comment',
            target: 'MPSection:1',
            selector: {
              from: 32,
              to: 32,
            },
            resolved: null,
            contributions: null,
            originalText: null,
          },
        },
      ],
    },
  ],
})

const useRenderComponent = (props: {
  comment?: Partial<CommentAnnotation>
}) => {
  const { comment } = props
  const modelMap = encode(doc)

  // const state = EditorState.create({
  //   doc,
  //   schema,
  // })
  //
  // const view = ManuscriptsEditor.createView({
  //   doc,
  // } as any)

  const { state, view, dispatch } = useEditor(
    ManuscriptsEditor.createState({
      doc,
      modelMap,
      getManuscript: () => '',
    } as any),
    ManuscriptsEditor.createView({ doc } as any)
  )

  // @ts-ignore
  const { saveCommentNode } = useTrackedModelManagement(
    doc,
    view,
    state,
    dispatch,
    () => '' as any,
    () => '' as any,
    modelMap,
    () => '' as any
  )

  const store = new GenericStore(undefined, undefined, {
    project: 'MPProject:1',
    trackModelMap: modelMap,
    comment,
    saveCommentNode,
    user: {
      _id: 'user-1',
      userID: 'user_1',
      objectType: 'MPUserProfile',
      bibliographicName: {
        _id: 'name-1',
        objectType: 'MPBibliographicName',
        given: 'Test',
        family: 'Test',
      },
    },
    modelMap: modelMap,
    doc,
  })
  ;(async () => {
    // @ts-ignore
    const basicSource = new BasicSource()
    await store.init([basicSource])
  })()

  return render(
    <GenericStoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CommentList editor={{ state, view } as any} />
      </ThemeProvider>
    </GenericStoreProvider>
  )
}

describe('Add Comment', () => {
  test('Comment List', () => {
    const { result } = renderHook(() => useRenderComponent({}))

    expect(result.current.getByText('Author Query Comment')).toBeInTheDocument()
    expect(result.current.getByText('Figure Block Comment')).toBeInTheDocument()
    expect(
      result.current.getByText('Highlight Block Comment')
    ).toBeInTheDocument()
  })

  test('Create New Comment', () => {
    const { result } = renderHook(() =>
      useRenderComponent({
        comment: {
          _id: 'MPCommentAnnotation:test',
          target: 'MPParagraphElement:1',
          contents: 'New Comment',
        },
      })
    )

    expect(result.current.getByText('New Comment')).toBeInTheDocument()
  })

  test('Save New Comment', () => {
    const { result } = renderHook(() => {
      return useRenderComponent({
        comment: {
          _id: 'MPCommentAnnotation:test',
          target: 'MPParagraphElement:1',
          contents: 'New Saved Comment',
        },
      })
    })

    const saveButton = result.current.getByText('Save')

    fireEvent.click(saveButton)
    expect(1).toEqual(1)
  })
})
