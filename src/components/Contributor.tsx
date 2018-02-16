import * as React from 'react'
import { styled } from '../theme'
import { Person } from '../types/person'

export interface ContributorProps {
  contributor: Person
}

const ContributorContainer = styled.div`
  display: inline-flex;
  background: #eee;
  border-radius: 50%;
`

export const Contributor: React.SFC<ContributorProps> = ({ contributor }) => (
  <ContributorContainer>
    <img src={contributor.image} />
  </ContributorContainer>
)
