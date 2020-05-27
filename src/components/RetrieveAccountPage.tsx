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

import AppIcon from '@manuscripts/assets/react/AppIcon'
import LandingDecorationsLeft from '@manuscripts/assets/react/LandingDecorationsLeft'
import LandingDecorationsRight from '@manuscripts/assets/react/LandingDecorationsRight'
import { TertiaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'
import {
  LandingDecorationsLeftContainer,
  LandingDecorationsRightContainer,
} from './IntroPage'
import { Centered } from './Page'

const Title = styled.div`
  text-align: center;
  color: #5e6f7e;
  font-weight: 300;
  padding-top: 24px;
  padding-bottom: 24px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    font-size: 16pt;
    width: 85%;
  }

  @media (min-width: 600px) {
    font-size: 32px;
    width: 502px;
  }
`

const AppIconContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: ${props => props.theme.grid.unit * 16}px;
`

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`

const PrimaryButton = styled.button`
  color: ${props => props.theme.colors.background.primary};
  background-color: #0d79d0;
  font-size: ${props => props.theme.grid.unit * 4}px;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  line-height: 1;
  font-family: Lato;

  &:hover {
    background-color: #0b6bb8;
  }
`
const Text = styled.div`
  padding: 12px 125px;
  white-space: nowrap;
  @media (max-width: 350px) {
    font-size: 14px;
  }
`
const Description = styled.div`
  padding-bottom: ${props => props.theme.grid.unit * 20}px;
  text-align: center;
  line-height: 1.5em;
  color: #6c6c6c;

  @media (max-width: 600px) {
    width: 85%;
  }

  @media (min-width: 600px) {
    width: 480px;
  }
`
const Note = styled.div`
  color: #949494;
  font-size: 14px;
  margin-top: ${props => props.theme.grid.unit * 4}px;
`

const SecondaryButton = styled(TertiaryButton)`
  margin-top: ${props => props.theme.grid.unit * 2}px;
  padding: 8px 12px;
  &:hover {
    background-color: none;
  }
`
const RetrieveText = styled(Text)`
  padding: 12px 80px;
`
interface Props {
  handleRetrieve: () => void
}
export const RetrieveAccountPage: React.FC<Props> = ({ handleRetrieve }) => (
  <Container>
    <LandingDecorationsLeftContainer>
      <LandingDecorationsLeft />
    </LandingDecorationsLeftContainer>
    <LandingDecorationsRightContainer>
      <LandingDecorationsRight />
    </LandingDecorationsRightContainer>

    <Centered>
      <AppIconContainer>
        <AppIcon />
      </AppIconContainer>
      <Title>Retrieve My Account</Title>
      <Description>
        By clicking “Retrieve My Account”, you will cancel your request to
        delete your account and you will have full access to your projects and
        to the projects you were invited to.
      </Description>
      <PrimaryButton onClick={handleRetrieve}>
        <RetrieveText>Retrieve my Account</RetrieveText>
      </PrimaryButton>
      <Note>You have 30 days to retrieve your account</Note>
    </Centered>
  </Container>
)

export const SorryPage = (props: RouteComponentProps) => (
  <Centered>
    <AppIconContainer>
      <AppIcon />
    </AppIconContainer>
    <Title>Sorry to see you go!</Title>
    <Description>
      Your account has been deleted but it will remain accessible for 30 days to
      download your existing data. In case you changed your mind, you can
      retrieve your account.
    </Description>
    <PrimaryButton onClick={() => props.history.push('/signup')}>
      <Text>Sign Up</Text>
    </PrimaryButton>
    <SecondaryButton onClick={() => props.history.push('/retrieve-account')}>
      Retrieve my Account
    </SecondaryButton>
  </Centered>
)
