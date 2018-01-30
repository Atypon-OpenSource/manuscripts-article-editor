const storage = window.localStorage

export default {
  get: () => storage.getItem('token'),
  set: (data: string) => storage.setItem('token', data),
  remove: () => storage.removeItem('token'),
}
