import * as React from 'react'
import UserIcon from '../icons/user'
import { styled } from '../theme'
import { Person } from '../types/person'

export const AuthorsContainer = styled('div')`
  padding: 20px 30px;
`

export const AuthorContainer = styled('div')`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary};
  }
`

const AuthorImage = styled('img')`
  display: inline-block;
  border-radius: 50%;
  margin-right: 10px;
  width: 40px;
  height: 40px;
  padding: 4px;
`

const AuthorNameParts = styled('div')`
  flex: 1;
  font-size: 20px;
  line-height: 22px;
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
  <AuthorContainer>
    {author.image ? (
      <AuthorImage src={author.image} />
    ) : (
      <AuthorIcon size={32} />
    )}
    <AuthorNameParts>
      <AuthorName>{author.name.substring(0, 1)}.</AuthorName>{' '}
      <AuthorSurname>{author.surname}</AuthorSurname>
    </AuthorNameParts>
  </AuthorContainer>
)

export interface AuthorsProps {
  authors: Person[]
}

export const Authors: React.SFC<AuthorsProps> = ({ authors }) => (
  <AuthorsContainer>
    {authors.map(author => <Author key={author._id} author={author} />)}
  </AuthorsContainer>
)
