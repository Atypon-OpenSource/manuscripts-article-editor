import React from 'react'
import { Subscription } from 'rxjs'
import CollaboratorsPage from '../components/CollaboratorsPage'
import { IconBar, Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import { Db, waitForDB } from '../lib/rxdb'
import {
  AddCollaborator,
  CollaboratorDocument,
  RemoveCollaborator,
  UpdateCollaborator,
} from '../types/collaborator'
import SidebarContainer from './SidebarContainer'

interface CollaboratorsPageContainerState {
  collaborators: CollaboratorDocument[]
  loaded: boolean
  error: string | null
}

class CollaboratorsPageContainer extends React.Component {
  public state: CollaboratorsPageContainerState = {
    collaborators: [],
    loaded: false,
    error: null,
  }

  private db: Db

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB
      .then(db => {
        this.db = db

        const sub = db.collaborators
          .find()
          // .sort({ name: 1 })
          .$.subscribe((collaborators: CollaboratorDocument[]) => {
            this.setState({
              collaborators,
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

  public addCollaborator: AddCollaborator = data => {
    return this.db.collaborators.insert(data)
  }

  // TODO: atomicUpdate?
  public updateCollaborator: UpdateCollaborator = (doc, data) =>
    doc.update({
      $set: data,
    })

  public removeCollaborator: RemoveCollaborator = doc => doc.remove()

  public render() {
    const { collaborators, loaded } = this.state

    if (!loaded) {
      return <Spinner />
    }

    return (
      <Page>
        <IconBar />
        <SidebarContainer />

        <Main>
          <CollaboratorsPage
            collaborators={collaborators}
            addCollaborator={this.addCollaborator}
            updateCollaborator={this.updateCollaborator}
            removeCollaborator={this.removeCollaborator}
          />
        </Main>
      </Page>
    )
  }
}

export default CollaboratorsPageContainer
