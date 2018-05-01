import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxError } from 'rxdb'
import { Subscription } from 'rxjs'
import ManuscriptsPage from '../components/ManuscriptsPage'
import { IconBar, Main, Page } from '../components/Page'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { generateID } from '../transformer/id'
import { MANUSCRIPT } from '../transformer/object-types'
import { AnyComponent, Manuscript } from '../types/components'
import {
  AddManuscript,
  ManuscriptDocument,
  RemoveManuscript,
  UpdateManuscript,
} from '../types/manuscript'
import SidebarContainer from './SidebarContainer'

interface State {
  manuscripts: ManuscriptDocument[]
  loaded: boolean
}

type Props = UserProps & ComponentsProps & RouteComponentProps<{}>

class ManuscriptsPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    manuscripts: [],
    loaded: false,
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    const collection = this.props.components.collection as RxCollection<
      AnyComponent
    >

    const sub = collection
      .find({ objectType: MANUSCRIPT })
      .sort({ createdAt: -1 })
      .$.subscribe((manuscripts: ManuscriptDocument[]) => {
        this.setState({
          manuscripts,
          loaded: true,
        })
      })

    this.subs.push(sub)
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { manuscripts, loaded } = this.state

    if (!loaded) {
      return <Spinner />
    }

    return (
      <Page>
        <IconBar />
        <SidebarContainer />

        <Main>
          <ManuscriptsPage
            manuscripts={manuscripts}
            addManuscript={this.addManuscript}
            updateManuscript={this.updateManuscript}
            removeManuscript={this.removeManuscript}
          />
        </Main>
      </Page>
    )
  }

  // TODO: catch and handle errors
  private addManuscript: AddManuscript = () => {
    const { user } = this.props

    // TODO: this should never happen
    if (!user.data) {
      throw new Error('Not authenticated!')
    }

    // TODO: open up the template modal

    const collection = this.props.components.collection as RxCollection<
      AnyComponent
    >

    const id = generateID('manuscript') as string
    const owner = (user.data._id as string).replace('|', '_')
    const now = Date.now()

    const manuscript: Manuscript = {
      id,
      manuscript: id,
      objectType: MANUSCRIPT,
      owners: [owner],
      createdAt: now,
      updatedAt: now,
      sessionID,
      title: '',
    }

    collection
      .insert(manuscript)
      .then((doc: ManuscriptDocument) => {
        this.props.history.push(`/manuscripts/${doc.get('id')}`)
      })
      .catch((error: RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  // TODO: atomicUpdate?
  // TODO: catch and handle errors
  private updateManuscript: UpdateManuscript = (doc, data) => {
    doc
      .update({
        $set: data,
      })
      .then(() => {
        console.log('saved') // tslint:disable-line
      })
      .catch((error: RxError) => {
        console.error(error) // tslint:disable-line
      })
  }

  private removeManuscript: RemoveManuscript = doc => event => {
    event.preventDefault()

    const collection = this.props.components.collection as RxCollection<
      AnyComponent
    >

    const manuscript = doc.id

    // TODO: just set the _deleted property

    doc.remove().then(() =>
      collection
        .find({
          manuscript,
        })
        .remove()
    )
  }
}

export default withComponents(withUser(ManuscriptsPageContainer))
