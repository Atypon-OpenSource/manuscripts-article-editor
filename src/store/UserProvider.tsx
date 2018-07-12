import React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import { atomicUpdate } from '../lib/store'
import token from '../lib/token'
import { USER_PROFILE } from '../transformer/object-types'
import { UserProfile } from '../types/components'
import { ComponentsProps, withComponents } from './ComponentsProvider'

export interface UserProviderState {
  loading: boolean
  loaded: boolean
  data: UserProfile | null
  error: string | null
}

export interface UserProviderContext extends UserProviderState {
  fetch: () => void
  update: (data: Partial<UserProfile>) => Promise<RxDocument<{}>>
}

export interface UserProps {
  user: UserProviderContext
}

export const UserContext = React.createContext<
  | UserProviderContext
  | {
      loaded: boolean
    }
>({
  loaded: false,
})

export const withUser = <T extends {}>(
  Component: React.ComponentType<UserProps>
): React.ComponentType<T> => (props: object) => (
  <UserContext.Consumer>
    {(value: UserProviderContext) => <Component {...props} user={value} />}
  </UserContext.Consumer>
)

const getUserIdFromJWT = (jwt: string): string =>
  JSON.parse(atob(jwt.split('.')[1])).userId.replace('|', '_')

const getAccessToken = () => {
  const tokenData = token.get() // TODO: listen for changes?

  if (!tokenData) return null

  return tokenData.access_token
}

export const getCurrentUserId = () => {
  const accessToken = getAccessToken()

  if (!accessToken) return null

  return getUserIdFromJWT(accessToken)
}

class UserProvider extends React.Component<ComponentsProps, UserProviderState> {
  public state: Readonly<UserProviderState> = {
    loading: false,
    loaded: false,
    data: null,
    error: null,
  }

  public async componentDidMount() {
    // try {
    //   await this.fetch()
    // } catch (e) {
    //   console.warn("Couldn't fetch current user from the API")
    // }

    this.subscribe()
  }

  public render() {
    const value = {
      ...this.state,
      fetch: this.fetch,
      update: this.update,
    }

    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
  }

  private buildCurrentUserQuery() {
    const userId = getCurrentUserId()

    return userId
      ? this.getCollection().findOne({
          objectType: USER_PROFILE,
          // _id: `${USER_PROFILE}:${userId.replace('_', '|')}`,
          userID: userId,
        })
      : null
  }

  private subscribe() {
    const query = this.buildCurrentUserQuery()

    if (!query) {
      this.setState({
        loading: false,
        loaded: true,
        data: null,
      })
      return
    }

    // TODO: remove token if user not found locally?
    query.$.subscribe((doc: RxDocument<UserProfile> | null) => {
      if (doc) {
        // const previousData = this.state.data

        const data: UserProfile = doc.toJSON()

        this.setState({
          loading: false,
          loaded: true,
          data,
        })

        // if (!previousData) {
        //   this.fetch()
        // }
      } else {
        this.setState({
          loading: false,
          loaded: true,
          data: null,
        })
      }
    })
  }

  private update = async (data: Partial<UserProfile>) => {
    const query = this.buildCurrentUserQuery()

    if (!query) {
      throw new Error('No current user')
    }

    const prev = await query.exec()

    if (!prev) {
      throw new Error('User object not found')
    }

    return atomicUpdate<UserProfile>(prev as RxDocument<UserProfile>, data)
  }

  private fetch = () => {
    if (!token.get()) {
      this.setState({
        loading: false,
        loaded: true,
        data: null,
        error: null,
      })
      return
    }

    // TODO: check this
    // if (!this.props.components.active) {
    //   this.props.components.sync({ live: false })
    // }

    // TODO: enable this once the API returns a user profile

    // this.setState({
    //   loading: true,
    //   // loaded: false,
    //   // data: null,
    //   error: null,
    // })
    //
    // api.fetchUser().then(
    //   (data: UserProfile | null) => {
    //     this.setState({
    //       loading: false,
    //       loaded: true,
    //       data,
    //     })
    //   },
    //   (error: AxiosError) => {
    //     if (error.response && error.response.status === 401) {
    //       // 401 response
    //       this.setState({
    //         loading: false,
    //         loaded: true,
    //       })
    //     } else {
    //       // any other error
    //       this.setState({
    //         loading: false,
    //         loaded: true,
    //         // error: error.message, // TODO: ignore?
    //       })
    //     }
    //   }
    // )
  }
}

export default withComponents(UserProvider)
