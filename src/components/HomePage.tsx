import * as React from 'react'
import { User } from '../types'
import { LinkButton } from './Button'
import { Hero } from './Hero'

interface HomePageProps {
  user: User
}

const HomePage: React.SFC<HomePageProps> = ({ user }) => (
  <React.Fragment>
    {user ? (
      <Hero>Welcome {user.name}</Hero>
    ) : (
      <React.Fragment>
        <LinkButton to={'/login'}>Sign in</LinkButton>
      </React.Fragment>
    )}
  </React.Fragment>
)

export default HomePage
