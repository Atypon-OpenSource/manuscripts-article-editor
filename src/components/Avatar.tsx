import React from 'react'
import UserIcon from '../icons/user'
import { styled } from '../theme/styled-components'
import { theme } from '../theme/theme'

interface AvatarProps {
  src?: string
  size: number
  color?: string
}

const AvatarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const RoundedImage = styled.img<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
`

export const Avatar: React.FunctionComponent<AvatarProps> = props => (
  <AvatarContainer>
    {props.src ? (
      <RoundedImage {...props} />
    ) : (
      <UserIcon {...props} color={props.color || theme.colors.profile.avatar} />
    )}
  </AvatarContainer>
)
