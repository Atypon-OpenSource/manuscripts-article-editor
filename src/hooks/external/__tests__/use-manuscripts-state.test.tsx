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

import React, { act } from 'react'
import { createRoot } from 'react-dom/client'

import { state } from '../../../store'
import {
  ManuscriptsStateObserver,
  ManuscriptsStateObserverContext,
  useManuscriptsState,
  useManuscriptsStateObserver,
} from '../use-manuscripts-state'

const buildState = (props: Record<string, unknown>) => props as unknown as state

const render = (Consumer: React.FC) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  let observer: ManuscriptsStateObserver

  const Harness: React.FC = () => {
    observer = useManuscriptsStateObserver()
    return (
      <ManuscriptsStateObserverContext.Provider value={observer}>
        <Consumer />
      </ManuscriptsStateObserverContext.Provider>
    )
  }

  act(() => root.render(<Harness />))

  return {
    // @ts-ignore assigned while rendering the harness above
    update: (props: Record<string, unknown>) =>
      act(() => observer.onUpdate(buildState(props))),
    unmount: () => {
      act(() => root.unmount())
      container.remove()
    },
  }
}

describe('useManuscriptsState', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  })

  it('must handle a selected object becoming null', () => {
    const selections: unknown[] = []

    const Consumer: React.FC = () => {
      const [selection] = useManuscriptsState(
        (s) => s.files?.find((f) => f.id === 'file-1') ?? null
      )
      selections.push(selection)
      return null
    }

    const { update, unmount } = render(Consumer)

    update({ files: [{ id: 'file-1', name: 'figure.png' }] })
    update({ files: [] })

    expect(selections.at(-1)).toBeNull()
    unmount()
  })

  it('must handle a selected map becoming null', () => {
    const selections: unknown[] = []

    const Consumer: React.FC = () => {
      const [selection] = useManuscriptsState((s) => s.collaborators)
      selections.push(selection)
      return null
    }

    const { update, unmount } = render(Consumer)

    update({ collaborators: new Map([['user', {}]]) })
    update({ collaborators: null })

    expect(selections.at(-1)).toBeNull()
    unmount()
  })

  it('must keep the previous selection while it stays the same', () => {
    const selections: unknown[] = []

    const Consumer: React.FC = () => {
      const [selection] = useManuscriptsState((s) => ({
        titleText: s.titleText,
      }))
      selections.push(selection)
      return null
    }

    const { update, unmount } = render(Consumer)

    update({ titleText: 'a title' })
    update({ titleText: 'a title' })

    expect(selections.at(-1)).toEqual({ titleText: 'a title' })
    expect(selections.at(-1)).toBe(selections.at(-2))
    unmount()
  })
})
