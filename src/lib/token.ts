const storage = window.localStorage

interface UserDetails {
  id: string
  name: string
  email: string
}
export interface Token {
  access_token: string
  sync_session: string
  user: UserDetails
}

export default {
  get: (): Token | null => {
    const token = storage.getItem('token')

    return token ? JSON.parse(token) : null
  },
  set: (data: Token): Token => {
    storage.setItem('token', JSON.stringify(data))

    return data
  },
  remove: () => storage.removeItem('token'),
}
