import { Token } from '../token'

let token: Token | null = null

export default {
  get: () => token,
  set: (data: Token) => (token = data),
  remove: () => (token = null),
}
