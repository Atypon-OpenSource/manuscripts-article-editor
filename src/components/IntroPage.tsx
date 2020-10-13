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

import FavIcon from '@manuscripts/assets/react/FavIcon'
import LandingDecorationsLeft from '@manuscripts/assets/react/LandingDecorationsLeft'
import LandingDecorationsRight from '@manuscripts/assets/react/LandingDecorationsRight'
import LogotypeGrey from '@manuscripts/assets/react/LogotypeGrey'
import React from 'react'
import styled from 'styled-components'

import AuthButtonContainer from './account/AuthButtonContainer'
import { Login, Signup } from './account/Authentication'
import { Centered } from './Page'

const Description = styled.div`
  text-align: center;
  color: #5e6f7e;
  font-weight: 300;
  padding-top: 1.5em;
  padding-bottom: 1em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    font-size: 16pt;
    width: 85%;
  }

  @media (min-width: 600px) {
    font-size: 36pt;
    width: 550px;
  }
`

export const LandingDecorationsLeftContainer = styled.div`
  position: absolute;
  pointer-events: none;

  @media (max-width: 600px) {
    display: none;
  }
`

export const LandingDecorationsRightContainer = styled.div`
  position: absolute;
  right: 0px;
  pointer-events: none;

  @media (max-width: 600px) {
    display: none;
  }
`

const AppIconContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 1.5rem;
`

const StyledLogotypeGrey = styled(LogotypeGrey)`
  @media (min-width: 600px) {
    width: 250px;
  }
`

const LogoContainer = styled.div`
  width: 10em;
`

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`
type AlertFunction = React.FunctionComponent

export const IntroPage: React.FC<{
  message?: AlertFunction
}> = ({ message: Message }) => (
  <Container>
    <LandingDecorationsLeftContainer>
      <LandingDecorationsLeft />
    </LandingDecorationsLeftContainer>
    <LandingDecorationsRightContainer>
      <LandingDecorationsRight />
    </LandingDecorationsRightContainer>
    <Header>
      <LogoContainer>
        <StyledLogotypeGrey width={'100%'} />
      </LogoContainer>
      <AuthButtonContainer component={Login} />
    </Header>
    {Message && <Message />}
    <Centered>
      <AppIconContainer>
        <FavIcon width={305} height={200} />
      </AppIconContainer>
      <Description>A simple authoring tool for complex documents.</Description>
      <AuthButtonContainer component={Signup} />
    </Centered>
  </Container>
)
