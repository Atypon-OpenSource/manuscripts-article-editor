import { EditorState } from 'prosemirror-state'
import * as React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import ManuscriptPage from '../components/ManuscriptPage'
import { DbInterface, waitForDB } from '../db'
import { Dispatch } from '../editor/config/types'
import Spinner from '../icons/spinner'
import { ManuscriptInterface, UpdateManuscript } from '../types/manuscript'
import { Person } from '../types/person'
import { AddSection, SectionInterface, UpdateSection } from '../types/section'

export interface ActiveType {
  state: EditorState
  dispatchTransaction: Dispatch
}

interface ManuscriptPageContainerState {
  manuscript: RxDocument<ManuscriptInterface> | null
  contributors: Array<RxDocument<Person>> | null
  sections: Array<RxDocument<SectionInterface>> | null
  active: ActiveType | null
}

interface ManuscriptPageContainerProps {
  id: string
}

interface ManuscriptPageRoute extends Route<RouteProps> {
  id: string
}

class ManuscriptPageContainer extends React.Component<
  ManuscriptPageContainerProps & RouteComponentProps<ManuscriptPageRoute>
> {
  public state: ManuscriptPageContainerState = {
    manuscript: null,
    contributors: null,
    sections: null,
    active: null,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    const { id } = this.props.match.params

    waitForDB
      .then(db => {
        this.db = db

        this.subs.push(
          db.manuscripts.findOne({ _id: id }).$.subscribe(manuscript => {
            this.setState({ manuscript })
          })
        )

        this.subs.push(
          db.manuscriptcontributors
            .find({ manuscript: id })
            .$.subscribe(contributors => {
              this.setState({ contributors })
            })
        )

        this.subs.push(
          db.sections
            .find({ manuscript: id })
            // .sort({ created: 1 })
            .$.subscribe(sections => {
              this.setState({ sections })

              if (!sections.length) {
                this.addSection({
                  title: 'Untitled Section',
                  content: '',
                })
              }
            })
        )
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

  public render() {
    const { manuscript, contributors, sections, active } = this.state

    if (manuscript === null || contributors === null || sections === null) {
      return <Spinner />
    }

    // TODO: display contributors in sidebar

    return (
      <ManuscriptPage
        manuscript={manuscript}
        contributors={contributors}
        sections={sections}
        active={active}
        updateManuscript={this.updateManuscript}
        updateSection={this.updateSection}
        setActive={this.setActive}
      />
    )
  }

  // TODO: atomicUpdate?
  // TODO: catch and handle errors
  private updateManuscript: UpdateManuscript = (doc, data) =>
    doc.update({
      $set: data,
    })

  private addSection: AddSection = data => {
    data.manuscript = this.props.match.params.id

    this.db.sections.insert(data)
  }

  private updateSection: UpdateSection = (doc, data) => {
    doc.update({
      $set: data,
    })
  }

  // private removeSection: RemoveSection = doc => event => {
  //   event.preventDefault()
  //
  //   doc.remove()
  // }

  private setActive = (state: EditorState, dispatchTransaction: Dispatch) => {
    this.setState({
      active: { state, dispatchTransaction },
    })
  }
}

export default ManuscriptPageContainer
