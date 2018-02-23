import * as React from 'react'
import { RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import GroupsPage from '../components/GroupsPage'
import { DbInterface, waitForDB } from '../db'
import Spinner from '../icons/spinner'
import { AddGroup, GroupInterface } from '../types/group'

interface GroupsPageContainerState {
  groups: Array<RxDocument<GroupInterface>> | null
  error: string | null
}

class GroupsPageContainer extends React.Component {
  public state: GroupsPageContainerState = {
    groups: null,
    error: null,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB
      .then(db => {
        this.db = db

        const sub = db.groups
          .find()
          // .sort({ created: 1 })
          .$.subscribe(groups => {
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
    this.db.groups.insert(data)
  }

  public render() {
    const { groups } = this.state

    if (groups === null) {
      return <Spinner />
    }

    return <GroupsPage groups={groups} addGroup={this.addGroup} />
  }
}

export default GroupsPageContainer
