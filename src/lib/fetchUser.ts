import { UserProviderContext } from '../store/UserProvider'

export const fetchUser = (value: UserProviderContext) => {
  return value.fetch()
}
