import decode from 'jwt-decode'
import tokenHandler from './token'

export interface TokenPayload {
  expiry: number
  userId: string
  userProfileId: string
  wayfLocal?: string
}

export const getCurrentUserId = () => {
  const token = tokenHandler.get()

  if (!token) return null

  const { userId } = decode<TokenPayload>(token)

  return userId.replace('|', '_')
}
