import { initials } from '../name'

describe('name processing methods', () => {
  it('single initial exists when "given" is present with one given name', () => {
    expect(
      initials({
        _id: 'MPBibliographicName:X',
        objectType: 'MPBibliographicName',
        given: 'Derek Gilbert',
        family: 'Dilbert',
      })
    ).toMatch('D.')
  })

  it('initials exist when "given" is present with more than one given name', () => {
    expect(
      initials({
        _id: 'MPBibliographicName:X',
        objectType: 'MPBibliographicName',
        given: 'Derek Gilbert',
        family: 'Dilbert',
      })
    ).toMatch('D.G.')
  })

  it('initials empty when no given name is present', () => {
    expect(
      initials({
        _id: 'MPBibliographicName:X',
        objectType: 'MPBibliographicName',
        family: 'Dilbert',
      })
    ).toMatch('')
  })
})
