const storage = window.localStorage

export interface Preferences {
  hideWelcome: boolean
}

const defaults = {
  hideWelcome: false,
}

export default {
  get: (): Preferences => {
    const preferences = storage.getItem('preferences')

    return preferences ? JSON.parse(preferences) : defaults
  },
  set: (data: Preferences): Preferences => {
    storage.setItem('preferences', JSON.stringify(data))

    return data
  },
  remove: () => storage.removeItem('preferences'),
}
