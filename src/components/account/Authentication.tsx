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

import {
  ButtonGroup,
  GoogleIcon,
  IconButton,
  OrcidIcon,
} from '@manuscripts/style-guide'
import React from 'react'
import connectLogo from '../../../assets/connect.png'
import config from '../../config'
import { styled } from '../../theme/styled-components'
import { AuthProvider } from './AuthButtonContainer'

const ButtonText = styled.div`
  color: ${props => props.theme.colors.text.secondary};
`

const IconButtonWithText = styled(IconButton)`
  margin: ${props => props.theme.grid.unit}px;
  padding: 0 ${props => props.theme.grid.unit * 4}px;
  width: auto;
`

const GoogleImage = styled.span`
  height: ${props => props.theme.grid.unit * 10}px;
  margin: -${props => props.theme.grid.unit}px 0 0 -${props =>
      props.theme.grid.unit}px;
`

const SignupButton = styled.button`
  color: ${props => props.theme.colors.background.primary};
  background-color: #0d79d0;
  font-size: 16pt;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  line-height: 1;
  font-family: Lato;
`
const LoginButton = styled.button`
  color: #6c6c6c;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
  border: solid 1px #ebebeb;
  border-radius: 4px;
`

const Text = styled.div`
  margin-right: 8px;
  font-weight: normal;
  font-size: 14px;

  @media (max-width: 600px) {
    display: none;
  }
`

const SignupText = styled.div`
  padding: 12px 125px;
  white-space: nowrap;
  @media (max-width: 350px) {
    font-size: 14px;
  }
`

const LoginText = styled.div`
  padding: 7px 15px;
`
export interface AuthenticationButtonProps {
  redirect: (provider: AuthProvider, action?: string) => () => void
}

export const GoogleLogin: React.FunctionComponent<
  AuthenticationButtonProps
> = ({ redirect }) => (
  <IconButtonWithText onClick={redirect('google')} defaultColor={true}>
    <GoogleImage>
      <GoogleIcon size={45} title={'Google logo'} />
    </GoogleImage>
    <ButtonText>Google</ButtonText>
  </IconButtonWithText>
)

export const OrcidLogin: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <IconButton onClick={redirect('orcid')} defaultColor={true}>
    <OrcidIcon size={48} />
  </IconButton>
)

export const ConnectLogin: React.FunctionComponent<
  AuthenticationButtonProps
> = ({ redirect }) => (
  <IconButtonWithText onClick={redirect('iam')}>
    <img src={connectLogo} height={25} alt={'Connect logo'} />
  </IconButtonWithText>
)

export const Signup: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <SignupButton
    onClick={
      config.connect.enabled
        ? redirect('iam', 'register')
        : () => window.location.assign('/signup')
    }
  >
    <SignupText>Sign Up</SignupText>
  </SignupButton>
)

export const Login: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <ButtonGroup>
    <Text>Already a user?</Text>
    <LoginButton
      onClick={
        config.connect.enabled
          ? redirect('iam', 'login')
          : () => window.location.assign('/login')
      }
    >
      <LoginText>Sign in</LoginText>
    </LoginButton>
  </ButtonGroup>
)

export const AuthenticationContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`
