import { registerWayfId } from '../wayf'

jest.mock('axios', () => ({
  patch: jest.fn((url, _x, body) => Promise.resolve(body)),
}))

describe('wayf ID registration', () => {
  it('registerWayfId', async () => {
    await expect(
      registerWayfId('foo.eyJ3YXlmTG9jYWwiOiJ4In0=', {
        key: 'wayf-key-value',
        url: 'wayf:///',
      })
    ).resolves.toMatchObject({
      headers: {
        Authorization: 'Bearer wayf-key-value',
      },
    })
  })
})
