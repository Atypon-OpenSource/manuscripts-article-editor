import React from 'react'
import { styled } from '../../theme'
import { AffiliationMap } from './lib/authors'

const Container = styled.table`
  border: none;
  margin-top: 16px;
`

interface Props {
  affiliations: AffiliationMap
}

export const Affiliations: React.SFC<Props> = ({ affiliations }) => (
  <Container>
    <tbody>
      {Array.from(affiliations.values()).map((affiliation, index) => (
        <tr key={affiliation.id}>
          <td>{index + 1}.</td>
          <td>{affiliation.name}</td>
        </tr>
      ))}
    </tbody>
  </Container>
)
