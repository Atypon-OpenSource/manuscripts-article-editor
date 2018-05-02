import React from 'react'
import { styled } from '../theme'
import { Affiliation, Person } from '../types/components'
import { PrimaryMiniButton } from './Button'
import { ModalFormHeading } from './Manage'

const AuthorDetailsContainer = styled('div')``

const AuthorDetailsHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
`

const AuthorDetailsSection = styled('div')`
  margin-bottom: 30px;
`

const Author = styled('div')`
  display: flex;
  margin-bottom: 10px;
`

const AuthorImage = styled('img')`
  display: block;
  border-radius: 50%;
  background: gray;
  width: 60px;
  height: 60px;
  margin-right: 20px;
`

const AuthorInfo = styled('div')`
  flex: 1;
`

const AuthorInfoSection = styled('div')`
  margin-bottom: 10px;
`

const AuthorNameParts = AuthorInfoSection.extend`
  font-size: 22px;
  line-height: 26px;
`
const AuthorName = styled('span')``

const AuthorSurname = styled('span')`
  font-weight: 600;
`

const AuthorEmail = AuthorInfoSection.extend`
  font-size: 15px;
  font-weight: 500;
`

const AuthorTel = AuthorInfoSection.extend`
  font-size: 15px;
  font-weight: 300;
`

const Affiliation = styled('div')`
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 10px;
`

const AffiliationName = styled('span')`
  font-weight: 600;
`

const AffiliationAddress = styled('span')`
  font-weight: normal;
`

export interface AuthorDetailsProps {
  author: Person
}

export const AuthorDetails = ({ author }: AuthorDetailsProps) => (
  <AuthorDetailsContainer>
    <AuthorDetailsHeader>
      <ModalFormHeading>Details</ModalFormHeading>
      <PrimaryMiniButton>Make author</PrimaryMiniButton>
    </AuthorDetailsHeader>

    <AuthorDetailsSection>
      <Author>
        <AuthorImage src={author.image} />

        <AuthorInfo>
          <AuthorNameParts>
            <AuthorName>{author.name}</AuthorName>{' '}
            <AuthorSurname>{author.surname}</AuthorSurname>
          </AuthorNameParts>
          <AuthorEmail>{author.email}</AuthorEmail>
          <AuthorTel>{author.tel}</AuthorTel>
        </AuthorInfo>
      </Author>
    </AuthorDetailsSection>

    {author.affiliations && (
      <AuthorDetailsSection>
        <AuthorDetailsHeader>
          <ModalFormHeading>Affiliations</ModalFormHeading>
        </AuthorDetailsHeader>

        {author.affiliations.map((affiliation: Affiliation) => (
          <Affiliation key={affiliation.id}>
            <AffiliationName>{affiliation.name}</AffiliationName>
            {', '}
            <AffiliationAddress>{affiliation.address}</AffiliationAddress>
          </Affiliation>
        ))}
      </AuthorDetailsSection>
    )}
  </AuthorDetailsContainer>
)
