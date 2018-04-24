import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '../theme'
import { Person } from '../types/components'
import { ManuscriptDocument, RemoveManuscript } from '../types/manuscript'
import { Button } from './Button'
import { Contributor } from './Contributor'

export const ManuscriptsContainer = styled.div`
  padding: 20px 20px;
`

export const ManuscriptContainer = styled(Link)`
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: #f1f8ff;
  }
`

const ManuscriptSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
`

const ManuscriptTitle = styled.span`
  opacity: 0.75;
  font-size: 20px;
  line-height: 24px;
`

const ManuscriptDate = styled.span`
  opacity: 0.75;
  font-size: 12px;
`

const ManuscriptContributors = styled.div``

export interface ManuscriptProps {
  manuscript: ManuscriptDocument
  contributors: Person[]
  removeManuscript: RemoveManuscript
}

const DeleteButton = Button.extend`
  color: #ddd;
  font-size: 10px;
`

const dateFormatter = new Intl.DateTimeFormat('en-GB')

const updatedAt = (manuscript: ManuscriptDocument) => {
  const time = manuscript.get('updatedAt')

  if (!time) return ''

  const date = new Date(time)

  return dateFormatter.format(date)
}

export const ManuscriptListItem: React.SFC<ManuscriptProps> = ({
  manuscript,
  contributors,
  removeManuscript,
}) => (
  <ManuscriptContainer to={`/manuscripts/${manuscript.get('id')}`}>
    <ManuscriptSection>
      <ManuscriptTitle>{manuscript.get('title')}</ManuscriptTitle>

      <ManuscriptContributors>
        {contributors.map(contributor => (
          <Contributor contributor={contributor} />
        ))}
      </ManuscriptContributors>
    </ManuscriptSection>

    <ManuscriptSection>
      <ManuscriptDate>{updatedAt(manuscript)}</ManuscriptDate>

      <DeleteButton onClick={removeManuscript(manuscript)}>Delete</DeleteButton>
    </ManuscriptSection>
  </ManuscriptContainer>
)

export interface ManuscriptsProps {
  manuscripts: ManuscriptDocument[]
  removeManuscript: RemoveManuscript
}

export const Manuscripts: React.SFC<ManuscriptsProps> = ({
  manuscripts,
  removeManuscript,
}) => (
  <ManuscriptsContainer>
    {manuscripts.map(manuscript => (
      <ManuscriptListItem
        key={manuscript.get('id')}
        manuscript={manuscript}
        contributors={[]}
        removeManuscript={removeManuscript}
      />
    ))}
  </ManuscriptsContainer>
)
