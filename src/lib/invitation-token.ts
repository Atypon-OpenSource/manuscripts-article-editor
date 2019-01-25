const storage = window.localStorage

export const INVITATION_TOKEN_KEY = 'invitationToken'

export default {
  get: () => storage.getItem(INVITATION_TOKEN_KEY),
  set: (token: string) => {
    storage.setItem(INVITATION_TOKEN_KEY, token)

    return token
  },
  remove: () => storage.removeItem(INVITATION_TOKEN_KEY),
}
