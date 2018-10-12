import React from 'react'
import { AffiliationMap } from '../../lib/authors'
import { styled } from '../../theme'

const Container = styled.table`
  border: none;
  margin-top: 16px;
  color: #949494;
  font-size: 15px;
  line-height: 1.73;
  letter-spacing: -0.1px;
`

const Header = styled.th`
  font-weight: normal;
  padding-right: 4px;
`

interface Props {
  affiliations: AffiliationMap
}

export const Affiliations: React.SFC<Props> = ({ affiliations }) => (
  <Container>
    <tbody>
      {Array.from(affiliations.values()).map((affiliation, index) => (
        <tr key={affiliation.id}>
          <Header>{index + 1}</Header>
          <td>{affiliation.name}</td>
        </tr>
      ))}
    </tbody>
  </Container>
)
