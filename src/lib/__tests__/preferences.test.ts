import Prefs, { defaults, Preferences } from '../preferences'

describe('preferences', () => {
  it('have defaults', () => {
    expect(Prefs.get()).toEqual(defaults)
  })

  it('can be set and removed', () => {
    const prefs: Preferences = { locale: 'en-US' }
    expect(Prefs.set(prefs)).toEqual(prefs)
    expect(Prefs.get()).toEqual(prefs)

    Prefs.remove()
    expect(Prefs.get()).toEqual(defaults) // check that we're back to defaults
  })
})
