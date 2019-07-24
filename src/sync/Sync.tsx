/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Model } from '@manuscripts/manuscripts-json-schema'
import { AlertMessage, AlertMessageType } from '@manuscripts/style-guide'
import * as HttpStatusCodes from 'http-status-codes'
import { isEqual } from 'lodash-es'
import React from 'react'
import { Link } from 'react-router-dom'
import { ModalProps, withModal } from '../components/ModalProvider'
import { refreshSyncSessions } from '../lib/api'
import { styled } from '../theme/styled-components'
import { Collection, CollectionProps } from './Collection'
import CollectionManager from './CollectionManager'
import { DatabaseError } from './DatabaseError'

const Toast = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

const StyledLink = styled(Link)`
  padding: 2rem;
  color: inherit;
`

interface State<T extends Model> {
  collection?: Collection<T>
  error?: Error | null
  errorStatusCode?: number | null
}

class Sync<T extends Model> extends React.PureComponent<
  CollectionProps & ModalProps,
  State<T>
> {
  public constructor(props: CollectionProps & ModalProps) {
    super(props)

    this.state = {}

    this.refreshSync = this.refreshSync.bind(this)
  }

  public async componentDidMount() {
    try {
      this.setState(
        {
          collection: await CollectionManager.createCollection<T>(this.props),
        },
        () => {
          this.state.collection!.addEventListener('error', e => {
            this.setState({
              error: new Error(e.type),
              errorStatusCode: e.detail.status || null,
            })
          })
        }
      )
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
    const { collection, error, errorStatusCode } = this.state

    if (error) {
      return (
        <React.Fragment>
          {this.props.children}
          <Toast>
            {errorStatusCode === HttpStatusCodes.UNAUTHORIZED ? (
              <AlertMessage
                type={AlertMessageType.warning}
                hideCloseButton={true}
              >
                <span>Please log in again to sync your changes</span>
                <StyledLink to="/">Log in again</StyledLink>
              </AlertMessage>
            ) : (
              <AlertMessage
                type={AlertMessageType.warning}
                dismissButton={{
                  text: 'Retry',
                  action: this.refreshSync,
                }}
              >
                Syncing your changes failed
              </AlertMessage>
            )}
          </Toast>
        </React.Fragment>
      )
    }

    if (!collection) {
      return null
    }

    return this.props.children
  }

  private refreshSync() {
    if (!this.state.collection) return
    this.setState({
      error: null,
    })

    // error listener is already bound, no need to catch
    // tslint:disable-next-line:no-floating-promises
    return refreshSyncSessions()
  }
}

export default withModal<CollectionProps>(Sync)
