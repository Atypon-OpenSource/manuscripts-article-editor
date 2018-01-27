import * as React from 'react'
import styled from 'styled-components'
import GoogleLogo from '../icons/google'
import OrcidLogo from '../icons/orcid'
import { IconButton } from './Button'

export interface AuthenticationButtonProps {
  openWindow: (provider: string) => void
}

export const GoogleLogin: React.SFC<AuthenticationButtonProps> = ({
  openWindow,
}) => (
  <IconButton type="button" onClick={() => openWindow('google')}>
    <GoogleLogo size={48} />
  </IconButton>
)

export const OrcidLogin: React.SFC<AuthenticationButtonProps> = ({
  openWindow,
}) => (
  <IconButton type="button" onClick={() => openWindow('orcid')}>
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
