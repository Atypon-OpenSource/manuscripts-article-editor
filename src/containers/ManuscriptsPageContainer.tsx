import * as React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
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

class ManuscriptsPageContainer extends React.Component {
  public state: ManuscriptsPageContainerState = {
    manuscripts: [],
    loaded: false,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB.then(db => {
      this.db = db

      const sub = (db.manuscripts as RxCollection<ManuscriptInterface>)
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
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public addManuscript: AddManuscript = data => {
    return this.db.manuscripts.insert(data)
  }

  // TODO: atomicUpdate?
  public updateManuscript: UpdateManuscript = (doc, data) => {
    return doc.update({
      $set: data,
    })
  }

  public removeManuscript: RemoveManuscript = doc => doc.remove()

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
