import { newestFirst, oldestFirst } from '../sort'

describe('sorting', () => {
  it('newestFirst', () => {
    // tslint:disable-next-line:no-any
    const x = { createdAt: 0 } as any
    // tslint:disable-next-line:no-any
    const y = { createdAt: 1 } as any
    // tslint:disable-next-line:no-any
    const z = { createdAt: 2 } as any
    expect(newestFirst(x, y)).toBeGreaterThan(0)
    expect(newestFirst(y, x)).toBeLessThan(0)
    expect([x, z, y].sort(newestFirst)).toMatchObject([z, y, x])
    expect([z, y, x].sort(newestFirst)).toMatchObject([z, y, x])
  })

  it('oldestFirst', () => {
    // tslint:disable-next-line:no-any
    const x = { createdAt: 0 } as any
    // tslint:disable-next-line:no-any
    const y = { createdAt: 1 } as any
    // tslint:disable-next-line:no-any
    const z = { createdAt: 2 } as any
    expect(oldestFirst(x, y)).toBeLessThan(0)
    expect(oldestFirst(y, x)).toBeGreaterThan(0)
    expect([x, z, y].sort(oldestFirst)).toMatchObject([x, y, z])
    expect([z, y, x].sort(oldestFirst)).toMatchObject([x, y, z])
  })
})
