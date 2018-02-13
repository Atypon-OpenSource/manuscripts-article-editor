import * as React from 'react'
import { RxDocument } from 'rxdb'
import { styled } from '../theme'
import {
  ManuscriptActions,
  ManuscriptInterface,
  RemoveManuscript,
} from '../types/manuscript'
import { ActionButton } from './Button'

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

export interface ManuscriptProps {
  manuscript: RxDocument<ManuscriptInterface>
  removeManuscript: RemoveManuscript
}

export const Manuscript: React.SFC<ManuscriptProps> = ({
  manuscript,
  removeManuscript,
}) => (
  <ManuscriptContainer>
    <ManuscriptTitle>{manuscript.title}</ManuscriptTitle>
    <ActionButton onClick={() => removeManuscript(manuscript)}>x</ActionButton>
  </ManuscriptContainer>
)

export interface ManuscriptsProps {
  manuscripts: Array<RxDocument<ManuscriptInterface>>
}

export const Manuscripts: React.SFC<ManuscriptsProps & ManuscriptActions> = ({
  manuscripts,
  removeManuscript,
}) => (
  <ManuscriptsContainer>
    {manuscripts.map(manuscript => (
      <Manuscript
        key={manuscript._id}
        manuscript={manuscript}
        removeManuscript={removeManuscript}
      />
    ))}
  </ManuscriptsContainer>
)
