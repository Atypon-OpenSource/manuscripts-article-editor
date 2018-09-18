import React from 'react'
import { Avatar } from '../../components/Avatar'
import AddAuthor from '../../icons/add-author'
import CorrespondingAuthorBadge from '../../icons/corresponding-author-badge'
import JointFirstAuthorBadge from '../../icons/joint-first-author-badge'
import VerticalEllipsis from '../../icons/vertical-ellipsis'
import { styled, ThemedProps } from '../../theme'
import { Contributor, UserProfile } from '../../types/components'
import { AuthorAffiliation } from './Author'
import { AuthorName } from './AuthorName'
import { isJointFirstAuthor } from './lib/authors'

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

const DeleteButton = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  border: none;
  cursor: pointer;
`

const AuthorItem = styled.div`
  padding: 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.25s;

  &:hover,
  &.active {
    background: #e0eef9;
  }
`

const AuthorMetadata = styled.div`
  display: flex;
  align-items: center;
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

const AvatarContainer = styled.span`
  display: inline-flex;
  position: relative;
`

const AuthorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const AuthorNotes = styled.span`
  position: absolute;
  top: 0;
  right: 0;

  & ${AuthorBadge}:not(:last-child) {
    right: -20%;
  }
`

const AuthorNameSpace = styled.span`
  margin-left: 12px;
`
interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  createAuthor: (priority: number) => void
  removeAuthor: (item: Contributor) => void
  selectAuthor: (item: Contributor) => void
  selectedAuthor: Contributor | null
}

const AuthorsSidebar: React.SFC<Props> = ({
  authors,
  authorAffiliations,
  createAuthor,
  removeAuthor,
  selectAuthor,
  selectedAuthor,
}) => (
  <Sidebar>
    <SidebarHeader>
      <SidebarTitle>Authors</SidebarTitle>
    </SidebarHeader>

    <SidebarAction>
      <AddButton
        onClick={() => {
          createAuthor(authors.length + 1)
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
        // const affiliations = authorAffiliations.get(author.id)
        // const user = users.findOne(author.profileID) // TODO

        const user: Partial<UserProfile> = {
          id: author.profileID,
        }

        return (
          <AuthorItem
            key={author.id}
            onClick={() => selectAuthor(author)}
            className={
              selectedAuthor && selectedAuthor.id === author.id ? 'active' : ''
            }
          >
            <AuthorMetadata>
              <AvatarContainer>
                <Avatar src={user.avatar} size={48} color={'#788faa'} />
                <AuthorNotes>
                  {author.isCorresponding && (
                    <AuthorBadge>
                      <CorrespondingAuthorBadge />
                    </AuthorBadge>
                  )}
                  {isJointFirstAuthor(authors, index) && (
                    <AuthorBadge>
                      <JointFirstAuthorBadge />
                    </AuthorBadge>
                  )}
                </AuthorNotes>
              </AvatarContainer>

              <AuthorNameSpace>
                <AuthorName name={author.bibliographicName} />
              </AuthorNameSpace>
              {/*<div>
                {affiliations &&
                  affiliations.map(affiliation => (
                    <AffiliationName key={affiliation.data.id}>
                      {affiliation.data.name}
                    </AffiliationName>
                  ))}
              </div>*/}
            </AuthorMetadata>

            <DeleteButton
              onClick={() => {
                removeAuthor(author)
              }}
            >
              <VerticalEllipsis />
            </DeleteButton>
          </AuthorItem>
        )
      })}
    </SidebarList>
  </Sidebar>
)

export default AuthorsSidebar
