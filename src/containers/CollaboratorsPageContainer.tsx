import * as React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import CollaboratorsPage from '../components/CollaboratorsPage'
import { DbInterface, waitForDB } from '../db'
import Spinner from '../icons/spinner'
import {
  AddCollaborator,
  CollaboratorInterface,
  RemoveCollaborator,
  UpdateCollaborator,
} from '../types/collaborator'

interface CollaboratorsPageContainerState {
  collaborators: Array<RxDocument<CollaboratorInterface>>
  loaded: boolean
}

class CollaboratorsPageContainer extends React.Component {
  public state: CollaboratorsPageContainerState = {
    collaborators: [],
    loaded: false,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB.then(db => {
      this.db = db

      const sub = (db.collaborators as RxCollection<CollaboratorInterface>)
        .find()
        .sort({ name: 1 })
        .$.subscribe(collaborators => {
          this.setState({
            collaborators,
            loaded: true,
          })
        })

      this.subs.push(sub)
    })
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public addCollaborator: AddCollaborator = data => {
    return this.db.collaborators.insert(data)
  }

  // TODO: atomicUpdate?
  public updateCollaborator: UpdateCollaborator = (doc, data) => {
    return doc.update({
      $set: data,
    })
  }

  public removeCollaborator: RemoveCollaborator = doc => doc.remove()

  public render() {
    const { collaborators, loaded } = this.state

    if (!loaded) {
      return <Spinner />
    }

    return (
      <CollaboratorsPage
        collaborators={collaborators}
        addCollaborator={this.addCollaborator}
        updateCollaborator={this.updateCollaborator}
        removeCollaborator={this.removeCollaborator}
      />
    )
  }
}

export default CollaboratorsPageContainer
