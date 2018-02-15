const storage = window.localStorage

export interface Token {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
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
