import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import ManuscriptsPage from '../components/ManuscriptsPage'
import { DbInterface, waitForDB } from '../db'
import Spinner from '../icons/spinner'
import {
  AddManuscript,
  ManuscriptInterface,
  RemoveManuscript,
  UpdateManuscript,
} from '../types/manuscript'

interface ManuscriptsPageContainerState {
  manuscripts: Array<RxDocument<ManuscriptInterface>>
  loaded: boolean
}

class ManuscriptsPageContainer extends React.Component<
  RouteComponentProps<{}>
> {
  public state: ManuscriptsPageContainerState = {
    manuscripts: [],
    loaded: false,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB
      .then(db => {
        this.db = db

        const sub = db.manuscripts
          .find()
          // .sort({ created: 1 })
          .$.subscribe(manuscripts => {
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

    this.db.manuscripts
      .insert(data)
      .then((doc: RxDocument<ManuscriptInterface>) => {
        this.props.history.push(`/manuscripts/${doc._id}`)
      })
  }

  // TODO: atomicUpdate?
  // TODO: catch and handle errors
  public updateManuscript: UpdateManuscript = (doc, data) => {
    doc.update({
      $set: data,
    })
  }

  // TODO: catch and handle errors
  public removeManuscript: RemoveManuscript = doc => event => {
    event.preventDefault()

    doc.remove()
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
