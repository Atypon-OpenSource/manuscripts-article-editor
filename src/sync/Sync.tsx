import { Model } from '@manuscripts/manuscripts-json-schema'
import { isEqual } from 'lodash-es'
import React from 'react'
import { ModalProps, withModal } from '../components/ModalProvider'
import { Collection, CollectionProps } from './Collection'
import CollectionManager from './CollectionManager'
import { DatabaseError } from './DatabaseError'

interface State<T extends Model> {
  collection?: Collection<T>
  error?: Error
}

class Sync<T extends Model> extends React.PureComponent<
  CollectionProps & ModalProps,
  State<T>
> {
  public constructor(props: CollectionProps & ModalProps) {
    super(props)

    this.state = {}
  }

  public async componentDidMount() {
    try {
      this.setState({
        collection: await CollectionManager.createCollection<T>(this.props),
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

export default withModal<CollectionProps>(Sync)
