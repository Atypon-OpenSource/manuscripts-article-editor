import React from 'react'
import AddAuthor from '../../icons/add-author'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { styled, ThemedProps } from '../../theme'
import { Contributor, UserProfile } from '../../types/models'
import { AuthorAffiliation } from './Author'
import DraggableAuthorItem from './DraggableAuthorItem'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const AddIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px 0 20px;
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: #353535;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`

const Sidebar = styled.div`
  background-color: #f8fbfe;
  border-top-left-radius: ${props => props.theme.radius}px;
  border-bottom-left-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  padding-bottom: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
`

const SidebarTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: #353535;
`

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const SidebarList = styled.div`
  flex: 1;
  overflow-y: auto;
`

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  selectedAuthor: Contributor | null
  isRemovePopperOpen: boolean
  checkInvitations: (author: Contributor) => boolean
  removeAuthor: (item: Contributor) => void
  selectAuthor: (item: Contributor) => void
  startAdding: () => void
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
  handleRemovePopperOpen: () => void
}

const AuthorsSidebar: React.SFC<Props> = ({
  authors,
  authorAffiliations,
  removeAuthor,
  selectAuthor,
  selectedAuthor,
  startAdding,
  handleDrop,
  checkInvitations,
  isRemovePopperOpen,
  handleRemovePopperOpen,
}) => (
  <Sidebar>
    <SidebarHeader>
      <SidebarTitle>Authors</SidebarTitle>
    </SidebarHeader>

    <SidebarAction>
      <AddButton
        onClick={() => {
          startAdding()
        }}
      >
        <AddIcon>
          <AddAuthor size={38} />
        </AddIcon>
        Add new author
      </AddButton>
    </SidebarAction>

    <SidebarList>
      {authors.map((author, index) => {
        // const affiliations = authorAffiliations.get(author._id)
        // const user = users.findOne(author.profileID) // TODO

        const user: Partial<UserProfile> = {
          _id: author.profileID,
        }

        const authorItem = {
          _id: author._id,
          priority: author.priority || null,
          index,
        }

        return (
          <DraggableAuthorItem
            key={author._id}
            authorItem={authorItem}
            onDrop={handleDrop}
            author={author}
            authors={authors}
            user={user}
            selectedAuthor={selectedAuthor}
            removeAuthor={removeAuthor}
            selectAuthor={selectAuthor}
            checkInvitations={checkInvitations}
            isRemovePopperOpen={isRemovePopperOpen}
            handleRemovePopperOpen={handleRemovePopperOpen}
          />
        )
      })}
    </SidebarList>
  </Sidebar>
)

export default AuthorsSidebar
