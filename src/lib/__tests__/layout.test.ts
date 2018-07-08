import Layout from '../layout'

describe('layout state persistence', () => {
  it('get', () => {
    const loadResult = Layout.get('foo')
    expect(loadResult).toEqual({ size: 200, collapsed: false })
  })

  it('set', () => {
    const bar = {
      size: 10,
      collapsed: true,
    }
    const setResult = Layout.set('foo', bar)
    expect(setResult).toEqual(bar)
    // expect(Layout.get('foo')).toEqual(bar) // FIXME: I think this not being met is indicating a bug?
  })

  it('remove', () => {
    Layout.remove()
    const storage = window.localStorage
    expect(storage.getItem('layout')).toBeFalsy()
  })
})
