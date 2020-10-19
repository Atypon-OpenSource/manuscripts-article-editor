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

import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Subscription } from 'rxjs'

import { Loading } from '../components/Loading'
import { Collection } from '../sync/Collection'
import { selectors } from '../sync/syncEvents'
import { SyncStateContext } from '../sync/SyncStore'

export abstract class DataComponent<
  T extends Model,
  Props extends {
    children: (
      data: T | T[] | Map<string, T> | null,
      collection: Collection<T>,
      restartSync: () => void
    ) => React.ReactNode
  },
  State extends { data?: T | T[] | Map<string, T> | null }
> extends React.PureComponent<Props & { placeholder?: JSX.Element }, State> {
  protected collection: Collection<T>
  protected sub: Subscription

  public render() {
    const { placeholder } = this.props
    return (
      <SyncStateContext.Consumer>
        {({ syncState }) =>
          this.state.data !== undefined &&
          selectors.isInitialPullComplete(
            this.collection.collectionName,
            syncState
          )
            ? // @ts-ignore
              this.props.children(
                this.state.data!,
                this.collection,
                this.restartSync
              )
            : placeholder || <Loading />
        }
      </SyncStateContext.Consumer>
    )
  }

  protected handleComplete = () => {
    this.forceUpdate()
  }

  protected restartSync = async () => {
    try {
      await this.collection.cancelReplications()
      await this.collection.initialize()
    } catch (error) {
      console.error('Error restarting sync', error)
    }
    this.forceUpdate()
  }
}
