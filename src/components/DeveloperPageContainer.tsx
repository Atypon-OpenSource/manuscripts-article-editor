import React from 'react'
import config from '../config'
import { createToken, createUserProfile } from '../lib/developer'
import { styled } from '../theme'
import { DatabaseContext } from './DatabaseProvider'

const DropdownAction = styled.div`
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #7fb5d5;
    color: white;
  }
`

const DropdownInfo = styled.div`
  padding: 10px 20px;
  white-space: nowrap;
`

export const MenuLabel = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  color: inherit;
  border-radius: 4px;
  margin-left: 20px;
`

const PlainLink = styled.a`
  color: inherit;
  text-decoration: none;
`

const DeveloperPageContainer: React.FunctionComponent = () => (
  <DatabaseContext.Consumer>
    {db => (
      <div>
        <DropdownAction
          onClick={() => {
            createToken()
            alert('Created token')
          }}
        >
          Create token
        </DropdownAction>

        <DropdownAction
          onClick={async () => {
            await createUserProfile(db)
            alert('Created user profile')
            window.location.href = '/'
          }}
        >
          Create user profile
        </DropdownAction>

        <DropdownAction
          onClick={async () => {
            await db.remove()
            alert('Removed database')
            window.location.href = '/'
          }}
        >
          Delete database
        </DropdownAction>

        {config.git.version && (
          <DropdownInfo>Version: {config.git.version}</DropdownInfo>
        )}

        {config.git.commit && (
          <DropdownInfo>Commit: {config.git.commit}</DropdownInfo>
        )}

        <DropdownInfo>
          <PlainLink href={`${config.api.url}/app/version`}>
            API version
          </PlainLink>
        </DropdownInfo>
      </div>
    )}
  </DatabaseContext.Consumer>
)

export default DeveloperPageContainer
