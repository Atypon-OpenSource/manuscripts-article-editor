import { EditorState } from 'prosemirror-state'
import * as React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { DbInterface, waitForDB } from '../db'
import { menu } from '../editor/config'
import { Dispatch } from '../editor/config/types'
import Editor from '../editor/Editor'
import MenuBar from '../editor/MenuBar'
import Spinner from '../icons/spinner'
import { styled } from '../theme'
import { ManuscriptInterface, UpdateManuscript } from '../types/manuscript'
import {
  AddSection,
  RemoveSection,
  SectionInterface,
  UpdateSection,
} from '../types/section'

const ManuscriptContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

const ManuscriptTools = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ManuscriptMain = styled.div`
  flex: 1;
  overflow: scroll;
`

const ManuscriptMetadata = styled.div`
  padding: 10px 20px;
  margin: 0 40px;
  background-color: #f1f8ff;
  border-radius: 10px;
`

const ManuscriptTitle = styled.div`
  margin-bottom: 10px;
  font-size: 32px;
  line-height: 38px;
  font-weight: bold;
  font-family: 'Adobe Garamond Pro', serif;
`

const ManuscriptEditor = styled.div`
  margin: 10px 40px;
`

interface ActiveType {
  state: EditorState
  dispatchTransaction: Dispatch
}

interface ManuscriptPageContainerState {
  manuscript: RxDocument<ManuscriptInterface> | null
  sections: Array<RxDocument<SectionInterface>> | null
  menubar: React.ReactNode | null
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
    sections: null,
    menubar: null,
    active: null,
  }

  private db: DbInterface

  private subs: Subscription[] = []

  public componentDidMount() {
    const { id } = this.props.match.params

    waitForDB.then(db => {
      this.db = db

      this.subs.push(
        (db.manuscripts as RxCollection<ManuscriptInterface>)
          .findOne({ _id: id })
          .$.subscribe(manuscript => {
            this.setState({
              manuscript,
              manuscriptLoaded: true,
            })
          })
      )

      this.subs.push(
        (db.sections as RxCollection<SectionInterface>)
          .find({ manuscript: id })
          // .sort({ created: 1 })
          .$.subscribe(sections => {
            this.setState({
              sections,
              sectionsLoaded: true,
            })

            if (!sections.length) {
              this.addSection({
                title: 'Untitled Section',
                content: '',
              })
            }
          })
      )
    })
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  // TODO: atomicUpdate?
  // TODO: catch and handle errors
  public updateManuscript: UpdateManuscript = (doc, data) => {
    doc.update({
      $set: data,
    })
  }

  public addSection: AddSection = data => {
    data.manuscript = this.props.match.params.id

    this.db.sections.insert(data)
  }

  public updateSection: UpdateSection = (doc, data) => {
    doc.update({
      $set: data,
    })
  }

  public removeSection: RemoveSection = doc => event => {
    event.preventDefault()

    doc.remove()
  }

  public setActive = (state: EditorState, dispatchTransaction: Dispatch) => {
    this.setState({
      active: { state, dispatchTransaction },
    })
  }

  public render() {
    const { manuscript, sections, active } = this.state

    if (manuscript === null || sections === null) {
      return <Spinner />
    }

    return (
      <ManuscriptContainer>
        <ManuscriptTools>
          {active && (
            <MenuBar
              menu={menu}
              state={active.state}
              dispatch={active.dispatchTransaction}
            />
          )}
        </ManuscriptTools>

        <ManuscriptMain>
          <ManuscriptMetadata>
            <ManuscriptTitle>{manuscript.title}</ManuscriptTitle>
          </ManuscriptMetadata>

          {sections.map((section, index) => (
            <ManuscriptEditor key={section._id}>
              <Editor
                autoFocus={index === 0}
                value={section.content}
                onChange={(content: string) =>
                  this.updateSection(section, { content })
                }
                setActive={this.setActive}
              />
            </ManuscriptEditor>
          ))}
        </ManuscriptMain>
      </ManuscriptContainer>
    )
  }
}

export default ManuscriptPageContainer
