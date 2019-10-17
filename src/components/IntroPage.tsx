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
import React from 'react'
import { styled } from '../theme/styled-components'
import AuthButtonContainer from './account/AuthButtonContainer'
import { Signup } from './account/Authentication'
import { Centered } from './Page'

const Description = styled.div`
  text-align: center;
  font-size: 48px;
  width: 500px;
  color: #5e6f7e;
  font-weight: 300;
  padding-top: 40px;
  padding-bottom: 45px;
  line-height: 1.17;
`

export const LandingDecorationsLeftContainer = styled.div`
  position: absolute;
  pointer-events: none;
`

export const LandingDecorationsRightContainer = styled.div`
  position: absolute;
  right: 0px;
  pointer-events: none;
`
export const IntroPage: React.FC = () => (
  <>
    <LandingDecorationsLeftContainer>
      <LandingDecorationsLeft />
    </LandingDecorationsLeftContainer>
    <LandingDecorationsRightContainer>
      <LandingDecorationsRight />
    </LandingDecorationsRightContainer>
    <Centered>
      <FavIcon width={305} height={200} />
      <Description>A simple authoring tool for complex documents.</Description>
      <AuthButtonContainer component={Signup} />
    </Centered>
  </>
)
