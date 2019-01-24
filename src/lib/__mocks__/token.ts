let token: string | null = null

export default {
  get: () => token,
  set: (data: string) => (token = data),
  remove: () => (token = null),
}
