import * as React from 'react'
import { AuthProvider } from '../containers/AuthButtonContainer'
import GoogleLogo from '../icons/google'
import OrcidLogo from '../icons/orcid'
import { styled } from '../theme'
import { IconButton } from './Button'

export interface AuthenticationButtonProps {
  redirect: (provider: AuthProvider) => () => void
}

export const GoogleLogin: React.SFC<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <IconButton type="button" onClick={redirect('google')}>
    <GoogleLogo size={48} />
  </IconButton>
)

export const OrcidLogin: React.SFC<AuthenticationButtonProps> = ({
  redirect,
}) => (
  <IconButton type="button" onClick={redirect('orcid')}>
    <OrcidLogo size={48} />
  </IconButton>
)

export const AuthenticationContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`
