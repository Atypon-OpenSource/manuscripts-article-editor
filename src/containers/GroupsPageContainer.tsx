import React from 'react'
import { Subscription } from 'rxjs'
import GroupsPage from '../components/GroupsPage'
import { IconBar, Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import { Db, waitForDB } from '../lib/rxdb'
import { AddGroup, GroupDocument } from '../types/group'
import SidebarContainer from './SidebarContainer'

interface GroupsPageContainerState {
  groups: GroupDocument[] | null
  error: string | null
}

class GroupsPageContainer extends React.Component {
  public state: GroupsPageContainerState = {
    groups: null,
    error: null,
  }

  private db: Db

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB
      .then(db => {
        this.db = db

        const sub = db.groups
          .find()
          // .sort({ created: 1 })
          .$.subscribe((groups: GroupDocument[]) => {
            this.setState({ groups })
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

  public addGroup: AddGroup = data => {
    this.db.groups.insert(data).catch((error: Error) => {
      this.setState({
        error: error.message,
      })
    })
  }

  public render() {
    const { groups } = this.state

    if (groups === null) {
      return <Spinner />
    }

    return (
      <Page>
        <IconBar />
        <SidebarContainer />

        <Main>
          <GroupsPage groups={groups} addGroup={this.addGroup} />
        </Main>
      </Page>
    )
  }
}

export default GroupsPageContainer
