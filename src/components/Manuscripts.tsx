import * as React from 'react'
import { styled } from '../theme'
import { ManuscriptInterface } from '../types/manuscript'

export const ManuscriptsContainer = styled('div')``

export const ManuscriptContainer = styled('div')`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary};
  }
`

const ManuscriptTitle = styled('span')``

export interface ManuscriptsProps {
  manuscripts: ManuscriptInterface[]
}

export const Manuscript: React.SFC<ManuscriptInterface> = ({ id, title }) => (
  <ManuscriptContainer>
    <ManuscriptTitle>{title}</ManuscriptTitle>
  </ManuscriptContainer>
)

export const Manuscripts: React.SFC<ManuscriptsProps> = ({ manuscripts }) => (
  <ManuscriptsContainer>
    {manuscripts.map(manuscript => (
      <Manuscript
        key={manuscript.id}
        id={manuscript.id}
        title={manuscript.title}
        createdAt={manuscript.createdAt}
        updatedAt={manuscript.updatedAt}
        authors={manuscript.authors}
      />
    ))}
  </ManuscriptsContainer>
)
