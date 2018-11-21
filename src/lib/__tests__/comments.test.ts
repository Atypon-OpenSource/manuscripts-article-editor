import { buildName } from '../comments'

describe('buildName', () => {
  it('buildName', () => {
    expect(
      buildName({
        given: 'Derek',
        family: 'Dilbert',
      })
    ).toEqual('Derek Dilbert')
  })
})
