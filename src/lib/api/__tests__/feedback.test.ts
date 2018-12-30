import client from '../../client'
import { feedback } from '../feedback'

jest.mock('../../deviceId')

jest.mock('../../client', () => ({
  post: jest.fn(),
}))

describe('authentication', () => {
  test('send feedback', async () => {
    const title = 'feedback'
    const message = 'message'

    await feedback(message, title)

    expect(client.post).toBeCalledWith('/user/feedback', {
      message,
      messagePrivately: true,
      title,
    })
  })
})
