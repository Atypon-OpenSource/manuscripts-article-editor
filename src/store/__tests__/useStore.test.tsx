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

import { GenericStore, GenericStoreProvider, state, useStore } from '..'

const buildStore = (initial: Partial<state> = {}) =>
  new GenericStore(undefined, undefined, {
    doc: {},
    titleText: 'first title',
    ...initial,
  } as unknown as state)

const render = (store: GenericStore, Component: React.FC) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(
      <GenericStoreProvider store={store}>
        <Component />
      </GenericStoreProvider>
    )
  })

  return () => {
    act(() => root.unmount())
    container.remove()
  }
}

describe('useStore', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  })

  it('must not re-render a component while its selection stays undefined', () => {
    const store = buildStore()
    let renders = 0

    const Component: React.FC = () => {
      useStore((s) => s.preventUnload)
      renders++
      return null
    }

    const unmount = render(store, Component)
    expect(renders).toBe(1)

    act(() => store.setState({ titleText: 'second title' } as state))
    act(() => store.setState({ titleText: 'third title' } as state))

    expect(renders).toBe(1)
    unmount()
  })

  it('must handle a selected object becoming null', () => {
    const store = buildStore({
      inspectorOpenTabs: { primaryTab: 1, secondaryTab: null },
    })
    const selections: unknown[] = []

    const Component: React.FC = () => {
      const [inspectorOpenTabs] = useStore((s) => s.inspectorOpenTabs)
      selections.push(inspectorOpenTabs)
      return null
    }

    const unmount = render(store, Component)
    act(() => store.setState({ inspectorOpenTabs: null } as unknown as state))

    expect(selections.at(-1)).toBeNull()
    unmount()
  })

  it('must re-render a component when its falsy selection changes', () => {
    const store = buildStore()
    const selections: unknown[] = []

    const Component: React.FC = () => {
      const [preventUnload] = useStore((s) => s.preventUnload)
      selections.push(preventUnload)
      return null
    }

    const unmount = render(store, Component)
    act(() => store.setState({ preventUnload: true } as state))
    act(() => store.setState({ preventUnload: false } as state))

    expect(selections).toEqual([undefined, true, false])
    unmount()
  })

  it('must re-render a component when its selected object changes', () => {
    const store = buildStore()
    const selections: string[] = []

    const Component: React.FC = () => {
      const [{ titleText }] = useStore((s) => ({ titleText: s.titleText }))
      selections.push(titleText)
      return null
    }

    const unmount = render(store, Component)
    act(() => store.setState({ titleText: 'second title' } as state))
    act(() => store.setState({ titleText: 'second title' } as state))

    expect(selections).toEqual(['first title', 'second title'])
    unmount()
  })
})
