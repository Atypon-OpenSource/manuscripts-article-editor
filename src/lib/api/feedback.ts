import client from '../client'

export const feedback = (message: string, title: string) =>
  client.post('/user/feedback', { message, messagePrivately: true, title })
