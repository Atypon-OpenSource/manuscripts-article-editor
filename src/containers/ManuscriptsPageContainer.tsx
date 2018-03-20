import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import RxDB from 'rxdb/plugins/core'
import { Subscription } from 'rxjs'
import ManuscriptsPage from '../components/ManuscriptsPage'
import { Db, waitForDB } from '../db'
import Spinner from '../icons/spinner'
import { generateID } from '../transformer/id'
import { MANUSCRIPT } from '../transformer/object-types'
import {
  AddManuscript,
  ManuscriptDocument,
  RemoveManuscript,
  UpdateManuscript,
} from '../types/manuscript'

interface ManuscriptsPageContainerState {
  manuscripts: ManuscriptDocument[]
  loaded: boolean
}

class ManuscriptsPageContainer extends React.Component<
  RouteComponentProps<{}>
> {
  public state: ManuscriptsPageContainerState = {
    manuscripts: [],
    loaded: false,
  }

  private db: Db

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB
      .then(db => {
        this.db = db

        const sub = db.components
          .find()
          .where('objectType')
          .eq(MANUSCRIPT)
          // .sort({ created: 1 })
          .$.subscribe((manuscripts: ManuscriptDocument[]) => {
            this.setState({
              manuscripts,
              loaded: true,
            })
          })

        this.subs.push(sub)
      })
      .catch((error: Error) => {
        this.setState({
          error: error.message,
        })
      })
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  // TODO: catch and handle errors
  public addManuscript: AddManuscript = data => {
    // TODO: open up the template modal

    const id = generateID(MANUSCRIPT)

    this.db.components
      .insert({
        id,
        manuscript: id,
        objectType: MANUSCRIPT,
        ...data,
      })
      .then((doc: ManuscriptDocument) => {
        this.props.history.push(`/manuscripts/${doc.get('id')}`)
      })
      .catch((error: RxDB.RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  // TODO: atomicUpdate?
  // TODO: catch and handle errors
  public updateManuscript: UpdateManuscript = (doc, data) => {
    doc
      .update({
        $set: data,
      })
      .then(() => {
        console.log('saved') // tslint:disable-line
      })
      .catch((error: RxDB.RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  public removeManuscript: RemoveManuscript = doc => event => {
    event.preventDefault()

    doc
      .remove()
      .then(() => {
        console.log('removed') // tslint:disable-line
      })
      .catch((error: RxDB.RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  public render() {
    const { manuscripts, loaded } = this.state

    if (!loaded) {
      return <Spinner />
    }

    return (
      <ManuscriptsPage
        manuscripts={manuscripts}
        addManuscript={this.addManuscript}
        updateManuscript={this.updateManuscript}
        removeManuscript={this.removeManuscript}
      />
    )
  }
}

export default ManuscriptsPageContainer
