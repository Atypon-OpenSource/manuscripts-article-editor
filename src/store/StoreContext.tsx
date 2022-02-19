/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
import React, { createContext, useContext, useEffect } from 'react'
import {
  buildStateFromSources,
  GenericStore,
  reducer,
  Store,
  StoreDataSourceStrategy,
} from '.'

const GenericStoreContext = createContext(new GenericStore({}))

export const createStore = async (
  dataSources: StoreDataSourceStrategy[],
  reducer?: reducer,
  unmountHandler?: Store['unmountHandler']
) => {
  const state = await buildStateFromSources(...dataSources)
  const beforeAction: Store['beforeAction'] = (...args) => {
    dataSources.map((ds) => ds.beforeAction && ds.beforeAction(...args))
  }
  return Object.seal(
    new GenericStore(state, reducer, beforeAction, unmountHandler)
  )
}

interface Props {
  store: Store
}

export const GenericStoreProvider: React.FC<Props> = ({ children, store }) => {
  if (store.constructor.name !== 'GenericStore') {
    throw new Error('GenericStoreProvider received incorrect store.')
  }
  useEffect(() => {
    return () => store.unmount()
  }, [store])

  return (
    <GenericStoreContext.Provider value={store}>
      {children}
    </GenericStoreContext.Provider>
  )
}

export const useGenericStore = () => useContext(GenericStoreContext)
