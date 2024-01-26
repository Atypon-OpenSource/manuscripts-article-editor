/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import AuthorPlaceholder from '@manuscripts/assets/react/AuthorPlaceholder'
import ContributorDetails from '@manuscripts/assets/react/ContributorDetailsPlaceholder'
import React from 'react'
import styled from 'styled-components'

const AddAuthorsMessage = () => (
  <span>Add authors to your author list from your collaborators, or invite new ones</span>
)
const SelectAuthorMessage = () => (
  <span>Select an author from the list to display their details here.</span>
)

const AddedAuthorsMessage: React.FunctionComponent<{
  addedCount: number
}> = ({ addedCount }) => <span>Authors added</span>

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
`

const InnerContainer = styled.div`
  text-align: center;
  max-width: 480px;
  font-size: ${(props) => props.theme.font.size.xlarge};
  line-height: ${(props) => props.theme.font.lineHeight.large};
`

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.grid.unit * 5}px;
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  letter-spacing: -0.5px;
`

const Message = styled.div`
  max-width: 400px;
  font-size: ${(props) => props.theme.font.size.xlarge};
  margin-top: ${(props) => props.theme.grid.unit * 6}px;
  font-weight: ${(props) => props.theme.font.weight.light};
  color: ${(props) => props.theme.colors.text.secondary};

  @media (max-width: 850px) {
    margin-right: ${(props) => props.theme.grid.unit * 5}px;
    margin-left: ${(props) => props.theme.grid.unit * 5}px;
    max-width: 350px;
  }
`

const AddedMessage = styled(Message)`
  margin-top: 2px;
`
interface AddAuthorsPageProps {
  addedAuthorsCount: number
}

const IconContainer = styled.div`
  display: flex;
  align-self: center;
  padding-right: 5px;
`

const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const AddAuthorsPage: React.FunctionComponent<AddAuthorsPageProps> = ({
  addedAuthorsCount,
}) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <AuthorPlaceholder />
      </Placeholder>

      {addedAuthorsCount ? (
        <MessageContainer data-cy={'add-author-message'}>
          <IconContainer>
            <AddedIcon />
          </IconContainer>

          <AddedMessage>
            <AddedAuthorsMessage addedCount={addedAuthorsCount} />
          </AddedMessage>
        </MessageContainer>
      ) : (
        <React.Fragment>
          <Action>Add Author</Action>
          <Message>
            <AddAuthorsMessage />
          </Message>
        </React.Fragment>
      )}
    </InnerContainer>
  </OuterContainer>
)

export const AuthorDetailsPage: React.FunctionComponent = () => (
  <OuterContainer data-cy={'author-details'}>
    <InnerContainer>
      <Placeholder>
        <ContributorDetails />
      </Placeholder>

      <React.Fragment>
        <Action>Author Details</Action>
        <Message>
          <SelectAuthorMessage />
        </Message>
      </React.Fragment>
    </InnerContainer>
  </OuterContainer>
)
