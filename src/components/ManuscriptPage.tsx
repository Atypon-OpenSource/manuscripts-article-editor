import { EditorState } from 'prosemirror-state'
import * as React from 'react'
import { RxDocument } from 'rxdb'
import { ActiveType } from '../containers/ManuscriptPageContainer'
import { menu } from '../editor/config'
import { Dispatch } from '../editor/config/types'
import Editor from '../editor/Editor'
import MenuBar from '../editor/MenuBar'
import { styled } from '../theme'
import { ManuscriptInterface, UpdateManuscript } from '../types/manuscript'
import { Person } from '../types/person'
import { SectionInterface, UpdateSection } from '../types/section'

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

interface ManuscriptPageProps {
  manuscript: RxDocument<ManuscriptInterface>
  contributors: Array<RxDocument<Person>>
  sections: Array<RxDocument<SectionInterface>>
  active: ActiveType | null
  setActive: (state: EditorState, dispatchTransaction: Dispatch) => void
  updateManuscript: UpdateManuscript
  updateSection: UpdateSection
}

const ManuscriptPage: React.SFC<ManuscriptPageProps> = ({
  manuscript,
  contributors,
  sections,
  active,
  setActive,
  updateManuscript,
  updateSection,
}) => (
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
            onChange={(content: string) => updateSection(section, { content })}
            setActive={setActive}
          />
        </ManuscriptEditor>
      ))}
    </ManuscriptMain>
  </ManuscriptContainer>
)

export default ManuscriptPage
