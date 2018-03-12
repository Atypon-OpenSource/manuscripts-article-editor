import * as React from 'react'
import { Link } from 'react-router-dom'
import { RxDocument } from 'rxdb'
import { styled } from '../theme'
import { Manuscript, Person } from '../types/components'
import { RemoveManuscript } from '../types/manuscript'
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
  manuscript: RxDocument<Manuscript>
  contributors: Person[]
  removeManuscript: RemoveManuscript
}

const DeleteButton = Button.extend`
  color: #ddd;
  font-size: 10px;
`

export const ManuscriptListItem: React.SFC<ManuscriptProps> = ({
  manuscript,
  contributors,
  removeManuscript,
}) => (
  <ManuscriptContainer to={`/manuscripts/${manuscript.id}`}>
    <ManuscriptSection>
      <ManuscriptTitle>{manuscript.title}</ManuscriptTitle>

      <ManuscriptContributors>
        {contributors.map(contributor => (
          <Contributor contributor={contributor} />
        ))}
      </ManuscriptContributors>
    </ManuscriptSection>

    <ManuscriptSection>
      <ManuscriptDate>{manuscript.updatedAt || '1 day ago'}</ManuscriptDate>

      <DeleteButton onClick={removeManuscript(manuscript)}>Delete</DeleteButton>
    </ManuscriptSection>
  </ManuscriptContainer>
)

export interface ManuscriptsProps {
  manuscripts: Array<RxDocument<Manuscript>>
  removeManuscript: RemoveManuscript
}

export const Manuscripts: React.SFC<ManuscriptsProps> = ({
  manuscripts,
  removeManuscript,
}) => (
  <ManuscriptsContainer>
    {manuscripts.map(manuscript => (
      <ManuscriptListItem
        key={manuscript.id}
        manuscript={manuscript}
        contributors={[]}
        removeManuscript={removeManuscript}
      />
    ))}
  </ManuscriptsContainer>
)
