import { AxiosError } from 'axios'
import React from 'react'
import { RxCollection, RxDocument } from 'rxdb'
import * as api from '../lib/api'
import token from '../lib/token'
import { AnyComponent, Contributor } from '../types/components'
import { User } from '../types/user'
import { SharedDataProps, withSharedData } from './SharedDataProvider'

export interface UserProviderState {
  loading: boolean
  loaded: boolean
  data: User | null
  error: string | null
}

export interface UserProviderContext extends UserProviderState {
  fetch: () => void
  update: (data: Partial<User>) => Promise<RxDocument<AnyComponent>>
}

export interface UserProps {
  user: UserProviderContext
}

export const UserContext = React.createContext<UserProviderContext | null>(null)

export const withUser = <T extends {}>(
  Component: React.ComponentType<UserProps>
): React.ComponentType<T> => (props: object) => (
  <UserContext.Consumer>
    {value => <Component {...props} user={value as UserProviderContext} />}
  </UserContext.Consumer>
)

const getUserIdFromJWT = (jwt: string): string =>
  JSON.parse(atob(jwt.split('.')[1])).userId.replace('|', '_')

const getCurrentUserId = () => {
  const tokenData = token.get() // TODO: listen for changes?

  return tokenData && tokenData.access_token
    ? getUserIdFromJWT(tokenData.access_token)
    : null
}

class UserProvider extends React.Component<SharedDataProps, UserProviderState> {
  public state: Readonly<UserProviderState> = {
    loading: false,
    loaded: false,
    data: null,
    error: null,
  }

  public componentDidMount() {
    const userId = getCurrentUserId()

    if (userId) {
      this.subscribe(userId)
    } else {
      this.fetch()
    }
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
    return this.props.shared.collection as RxCollection<AnyComponent>
  }

  private subscribe(id: string) {
    // TODO: a User object instead of Contributor?
    this.getCollection()
      .findOne({
        // objectType: CONTRIBUTOR,
        // _id: id,
        user_id: id,
      })
      .$.subscribe((doc: RxDocument<Contributor>) => {
        if (doc) {
          const previousData = this.state.data

          const data: User = {
            _id: doc.get('id'),
            email: doc.get('email') as string,
            name: doc.get('name'),
            familyName: doc.get('familyName'),
            givenName: doc.get('givenName'),
            phone: doc.get('phone'),
          }

          this.setState({
            loaded: true,
            data,
          })

          if (!previousData) {
            this.fetch()
          }
        }
      })
  }

  private update = async (data: Partial<User>) => {
    const userId = getCurrentUserId()

    const prev = await this.getCollection()
      .findOne({
        channel_id: userId,
      })
      .exec()

    if (!prev) {
      throw new Error('User object not found')
    }

    return prev.atomicUpdate((doc: RxDocument<User>) => {
      Object.entries(data).forEach(([key, value]) => {
        doc.set(key, value)
      })
    })
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

    this.setState({
      loading: true,
      // loaded: false,
      // data: null,
      error: null,
    })

    api.authenticate().then(
      (data: User | null) => {
        this.setState({
          loading: false,
          loaded: true,
          data,
        })
      },
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          // 401 response
          this.setState({
            loading: false,
            loaded: true,
          })
        } else {
          // any other error
          this.setState({
            loading: false,
            loaded: true,
            error: error.message,
          })
        }
      }
    )
  }
}

export default withSharedData(UserProvider)
