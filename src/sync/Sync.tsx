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
import { isEqual } from 'lodash-es'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ModalProps, withModal } from '../components/ModalProvider'
import { TokenActions } from '../data/TokenData'
import { Collection, CollectionProps } from './Collection'
import CollectionManager from './CollectionManager'
import { DatabaseError } from './DatabaseError'

interface State<T extends Model> {
  collection?: Collection<T>
  error?: Error
}

type Props = CollectionProps &
  ModalProps &
  RouteComponentProps & {
    tokenActions: TokenActions
  }

class Sync<T extends Model> extends React.PureComponent<Props, State<T>> {
  public constructor(props: Props) {
    super(props)

    this.state = {}
  }

  public async componentDidMount() {
    try {
      const { addModal, ...collectionProps } = this.props

      this.setState({
        collection: await CollectionManager.createCollection<T>(
          collectionProps
        ),
      })
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console

      if (error.name === 'RxError') {
        this.props.addModal('database-error', () => <DatabaseError />)
      } else {
        this.setState({ error })
      }
    }
  }

  public async componentWillReceiveProps(
    nextProps: CollectionProps & ModalProps
  ) {
    const { collection, channels } = nextProps

    const channelsChanged = !isEqual(channels, this.props.channels)

    if (collection !== this.props.collection || channelsChanged) {
      if (this.state.collection) {
        // TODO: a destroy/close method on Collection??
        await this.state.collection.cancelReplications()

        this.setState({
          collection: undefined,
        })
      }

      // remove the collection from the local database if the list of channels changes
      // TODO: enable this if syncing and data components can re-attach
      // if (channelsChanged) {
      //   const collectionToRemove = CollectionManager.getCollection<T>(
      //     collection
      //   ).collection
      //
      //   if (collectionToRemove) {
      //     await collectionToRemove.remove()
      //   }
      // }

      CollectionManager.removeCollection(collection)

      this.setState({
        collection: await CollectionManager.createCollection<T>(this.props),
      })
    }
  }

  public componentWillUnmount() {
    const { collection } = this.state

    if (collection) {
      collection.cancelReplications().catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
    }

    CollectionManager.removeCollection(this.props.collection)
  }

  public render() {
    const { collection, error } = this.state

    // TODO: display sync connection errors, or handle them silently?

    if (error) {
      return null
    }

    if (!collection) {
      return null
    }

    return this.props.children
  }
}

export default withModal(withRouter(Sync))
