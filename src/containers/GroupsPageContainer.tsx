import * as React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import GroupsPage from '../components/GroupsPage'
import { DbInterface, waitForDB } from '../db'
import Spinner from '../icons/spinner'
import {
  AddGroup,
  GroupInterface,
  RemoveGroup,
  UpdateGroup,
} from '../types/group'

interface GroupsPageContainerState {
  groups: Array<RxDocument<GroupInterface>>
  loaded: boolean
}

class GroupsPageContainer extends React.Component {
  public state: GroupsPageContainerState = {
    groups: [],
    loaded: false,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    waitForDB.then(db => {
      this.db = db

      const sub = (db.groups as RxCollection<GroupInterface>)
        .find()
        // .sort({ created: 1 })
        .$.subscribe(groups => {
          this.setState({
            groups,
            loaded: true,
          })
        })

      this.subs.push(sub)
    })
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public addGroup: AddGroup = data => {
    return this.db.groups.insert(data)
  }

  // TODO: atomicUpdate?
  public updateGroup: UpdateGroup = (doc, data) => {
    return doc.update({
      $set: data,
    })
  }

  public removeGroup: RemoveGroup = doc => doc.remove()

  public render() {
    const { groups, loaded } = this.state

    if (!loaded) {
      return <Spinner />
    }

    return (
      <GroupsPage
        groups={groups}
        addGroup={this.addGroup}
        updateGroup={this.updateGroup}
        removeGroup={this.removeGroup}
      />
    )
  }
}

export default GroupsPageContainer
