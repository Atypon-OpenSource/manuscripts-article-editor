/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Button,
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
  padding-right: 18px;
  color: #959595;
  font-weight: 500;
  position: relative;
  bottom: 1px;
`

const IconButtonWithText = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0px 1px #ddd;
  margin: 10px;
`

const GoogleImage = styled.span`
  height: 25px;
  padding: 5px 10px 5px 18px;
`

const ConnectImage = styled.span`
  height: 25px;
  padding: 5px 18px;
  margin: auto;
`

const TextButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px;
  color: white;
  font-weight: 200;
`

const SignupButton = styled(Button)`
  background-color: white;
  color: ${props => props.theme.colors.button.primary};
  margin-left: 10px;
`
export interface AuthenticationButtonProps {
  redirect: (provider: AuthProvider) => () => void
}

export const GoogleLogin: React.FunctionComponent<
  AuthenticationButtonProps
> = ({ redirect }) => (
  <IconButtonWithText onClick={redirect('google')}>
    <GoogleImage>
      <GoogleIcon size={25} title={'Google logo'} />
    </GoogleImage>
    <ButtonText>Google</ButtonText>
  </IconButtonWithText>
)

export const OrcidLogin: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <IconButton type={'button'} onClick={redirect('orcid')}>
    <OrcidIcon size={48} />
  </IconButton>
)

export const ConnectLogin: React.FunctionComponent<
  AuthenticationButtonProps
> = ({ redirect }) => (
  <IconButtonWithText onClick={redirect('iam')}>
    <ConnectImage>
      <img src={connectLogo} height={25} alt={'Connect logo'} />
    </ConnectImage>
  </IconButtonWithText>
)

export const Signup: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <SignupButton
    onClick={
      config.connect.enabled
        ? redirect('iam')
        : () => (window.location.href = '/signup')
    }
  >
    sign up
  </SignupButton>
)

export const Login: React.FunctionComponent<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <TextButton
    onClick={
      config.connect.enabled
        ? redirect('iam')
        : () => (window.location.href = '/login')
    }
  >
    Already have an account?
  </TextButton>
)

export const AuthenticationContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`
