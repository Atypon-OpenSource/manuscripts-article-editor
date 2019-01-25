const storage = window.localStorage

export const TOKEN_KEY = 'token'

export default {
  get: () => storage.getItem(TOKEN_KEY),
  set: (token: string) => {
    storage.setItem(TOKEN_KEY, token)

    return token
  },
  remove: () => storage.removeItem(TOKEN_KEY),
}
