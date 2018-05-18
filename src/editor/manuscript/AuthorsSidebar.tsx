import React from 'react'
import { Button } from '../../components/Button'
import Add from '../../icons/add'
import { styled } from '../../theme'
import { Contributor } from '../../types/components'
import { AuthorAffiliation } from './Author'
import { AuthorName } from './AuthorName'

const AddIcon = styled.button`
  border: none;
  background: #fdcd47;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;

  &:hover {
    background: #fda72e;
  }
`

const AuthorItem = styled.div`
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.25s;

  &:hover {
    background: #eee;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`

// const AffiliationName = styled.div`
//   font-size: 90%;
// `

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const SidebarTitle = styled.div`
  font-size: 120%;
  font-weight: bold;
`

const Sidebar = styled.div`
  padding-right: 10px;
`

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  createAuthor: (priority: number) => void
  removeAuthor: (item: Contributor) => void
  selectAuthor: (item: Contributor) => void
}

const AuthorsSidebar: React.SFC<Props> = ({
  authors,
  authorAffiliations,
  createAuthor,
  removeAuthor,
  selectAuthor,
}) => (
  <Sidebar>
    <SidebarHeader>
      <SidebarTitle>Authors</SidebarTitle>

      <AddIcon
        onClick={() => {
          createAuthor(authors.length + 1)
        }}
      >
        <Add color={'#fff'} size={16} />
      </AddIcon>
    </SidebarHeader>

    {authors.map(author => {
      // const affiliations = authorAffiliations.get(author.id)

      return (
        <AuthorItem key={author.id} onClick={() => selectAuthor(author)}>
          <div>
            <AuthorName name={author.bibliographicName} />
            {/*<div>
              {affiliations &&
                affiliations.map(affiliation => (
                  <AffiliationName key={affiliation.data.id}>
                    {affiliation.data.name}
                  </AffiliationName>
                ))}
            </div>*/}
          </div>

          <Button
            type={'button'}
            onClick={() => {
              removeAuthor(author)
            }}
          >
            -
          </Button>
        </AuthorItem>
      )
    })}
  </Sidebar>
)

export default AuthorsSidebar
