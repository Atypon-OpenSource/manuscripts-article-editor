import * as React from 'react'
import styled from 'styled-components'
import GoogleLogo from '../icons/google'
import OrcidLogo from '../icons/orcid'
import { IconButton } from './Button'

const openLoginWindow = (provider: string) => () => {
  const width = 800
  const height = 400
  const left = window.screenX + (window.outerWidth - width) / 2
  const right = window.screenY + (window.outerHeight - height) / 2.5

  // const opened = window.open(
  window.open(
    process.env.API_BASE_URL + '/authentication/' + provider,
    'oauth',
    `width=${width},height=${height},left=${left},right=${right}`
  )

  // TODO: listen for message from the opened window
}

export const GoogleLogin = () => (
  <IconButton type="button" onClick={openLoginWindow('google')}>
    <GoogleLogo size={48} />
  </IconButton>
)

export const OrcidLogin = () => (
  <IconButton type="button" onClick={openLoginWindow('orcid')}>
    <OrcidLogo size={48} />
  </IconButton>
)

export const AuthContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`
