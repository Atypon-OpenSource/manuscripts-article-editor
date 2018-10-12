import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../../editor/title/Title'
import { styled } from '../../theme'
import { Contributor, Manuscript } from '../../types/components'
import { RemoveManuscript } from '../../types/manuscript'
import { Button } from '../Button'

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

const ManuscriptTitle = styled.div`
  opacity: 0.75;
  font-size: 20px;
  line-height: 24px;
`

const ManuscriptDate = styled.span`
  opacity: 0.75;
  font-size: 12px;
`

const DeleteButton = styled(Button)`
  color: #ddd;
  font-size: 10px;
`

const dateFormatter = new Intl.DateTimeFormat('en-GB')

const updatedAt = (manuscript: Manuscript) => {
  const time = manuscript.updatedAt

  if (!time) return ''

  const date = new Date(time * 1000)

  return dateFormatter.format(date)
}

interface ManuscriptProps {
  manuscript: Manuscript
  contributors: Contributor[]
  removeManuscript: RemoveManuscript
}

export const ManuscriptListItem: React.SFC<ManuscriptProps> = ({
  manuscript,
  contributors,
  removeManuscript,
}) => (
  <ManuscriptContainer
    to={`/projects/${manuscript.containerID}/manuscripts/${manuscript.id}`}
  >
    <ManuscriptSection>
      <ManuscriptTitle>
        <Title value={manuscript.title} />
      </ManuscriptTitle>
    </ManuscriptSection>

    <ManuscriptSection>
      <ManuscriptDate>{updatedAt(manuscript)}</ManuscriptDate>

      <DeleteButton onClick={removeManuscript(manuscript.id)}>
        Delete
      </DeleteButton>
    </ManuscriptSection>
  </ManuscriptContainer>
)

interface ManuscriptsProps {
  manuscripts: Manuscript[]
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
