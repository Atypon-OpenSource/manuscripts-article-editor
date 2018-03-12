import * as React from 'react'
import { Link } from 'react-router-dom'
import UserIcon from '../icons/user'
import { styled } from '../theme'
import { Person } from '../types/components'

export const AuthorsContainer = styled('div')`
  padding: 20px 30px;
`

export const AuthorContainer = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;

  &:hover {
    background-color: #f1f8ff;
  }
`

const AuthorImage = styled('img')`
  display: inline-block;
  border-radius: 50%;
  width: 36px;
  height: 36px;
`

const AuthorNameParts = styled('div')`
  flex: 1;
  font-size: 20px;
  padding: 5px 10px;
  line-height: 35px;
  border-bottom: 1px solid #f6f6f6;
`
const AuthorName = styled('span')``

const AuthorSurname = styled('span')`
  font-weight: 600;
`

const AuthorIcon = styled(UserIcon)`
  border-radius: 50%;
  margin-right: 10px;
  background-color: #4489d8;
`

export interface AuthorProps {
  author: Person
}

export const Author: React.SFC<AuthorProps> = ({ author }) => (
  <AuthorContainer to={`/collaborators/${author.id}`}>
    {author.image ? (
      <AuthorImage src={author.image} />
    ) : (
      <AuthorIcon size={32} />
    )}
    <AuthorNameParts>
      <AuthorName>{author.name}</AuthorName>{' '}
      <AuthorSurname>{author.surname}</AuthorSurname>
    </AuthorNameParts>
  </AuthorContainer>
)

export interface AuthorsProps {
  authors: Person[]
}

export const Authors: React.SFC<AuthorsProps> = ({ authors }) => (
  <AuthorsContainer>
    {authors.map(author => <Author key={author.id} author={author} />)}
  </AuthorsContainer>
)
