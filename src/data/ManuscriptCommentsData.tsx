import {
  COMMENT_ANNOTATION,
  CommentAnnotation,
} from '@manuscripts/manuscript-editor'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (comments: CommentAnnotation[]) => React.ReactNode
  manuscriptID: string
  projectID: string
}

interface State {
  comments?: CommentAnnotation[]
}

class ManuscriptCommentsData extends React.Component<
  Props & ModelsProps,
  State
> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { projectID, manuscriptID } = this.props

    this.sub = this.loadComments(projectID, manuscriptID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { projectID, manuscriptID } = nextProps

    if (
      manuscriptID !== this.props.manuscriptID ||
      projectID !== this.props.projectID
    ) {
      this.sub.unsubscribe()
      this.setState({ comments: undefined })
      this.sub = this.loadComments(projectID, manuscriptID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { comments } = this.state

    if (!comments) {
      return <Spinner />
    }

    return this.props.children(comments)
  }

  private loadComments = (containerID: string, manuscriptID: string) => {
    const collection = this.props.models.collection as RxCollection<
      CommentAnnotation
    >

    return collection
      .find({
        containerID,
        manuscriptID,
        objectType: COMMENT_ANNOTATION,
        // objectType: ObjectTypes.CommentAnnotation, // TODO
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            comments: docs.map(doc => doc.toJSON()),
          })
        }
      })
  }
}

export default withModels<Props>(ManuscriptCommentsData)
