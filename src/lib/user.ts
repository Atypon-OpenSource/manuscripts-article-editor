import decode from 'jwt-decode'
import token from './token'

interface Payload {
  expiry: number
  userId: string
  userProfileId: string
  wayfLocal?: string
}

const getAccessToken = () => {
  const tokenData = token.get() // TODO: listen for changes?

  if (!tokenData) return null

  return tokenData.access_token
}

export const getCurrentUserId = () => {
  const accessToken = getAccessToken()

  if (!accessToken) return null

  const { userId } = decode<Payload>(accessToken)

  return userId.replace('|', '_')
}
