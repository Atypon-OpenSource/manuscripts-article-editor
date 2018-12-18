const storage = window.localStorage

export interface Preferences {
  locale: string
}

export const defaults = {
  locale: 'en',
}

export default {
  get: (): Preferences => {
    const preferences = storage.getItem('preferences')

    // TODO: merge defaults?

    return preferences ? JSON.parse(preferences) : defaults
  },
  set: (data: Preferences): Preferences => {
    storage.setItem('preferences', JSON.stringify(data))

    return data
  },
  remove: () => storage.removeItem('preferences'),
}
