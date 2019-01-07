import {
  ObjectTypes,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (
    affiliations: Map<string, UserProfileAffiliation>
  ) => React.ReactNode
  profileID: string
}

interface State {
  affiliations?: Map<string, UserProfileAffiliation>
}

class UserAffiliationsData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { profileID } = this.props

    this.sub = this.loadAffiliations(profileID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { profileID } = nextProps

    if (profileID !== this.props.profileID) {
      this.sub.unsubscribe()
      this.setState({ affiliations: undefined })
      this.sub = this.loadAffiliations(profileID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { affiliations } = this.state

    if (!affiliations) {
      return <Spinner />
    }

    return this.props.children(affiliations)
  }

  private loadAffiliations = (containerID: string) => {
    const collection = this.props.models.collection as RxCollection<
      UserProfileAffiliation
    >

    return collection
      .find({
        containerID,
        objectType: ObjectTypes.UserProfileAffiliation,
      })
      .$.subscribe(docs => {
        if (docs) {
          const affiliations = new Map()

          for (const doc of docs) {
            affiliations.set(doc._id, doc.toJSON())
          }

          this.setState({ affiliations })
        }
      })
  }
}

export default withModels<Props>(UserAffiliationsData)
