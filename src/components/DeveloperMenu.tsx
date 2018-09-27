import React from 'react'
import config from '../config'
import { databaseCreator } from '../lib/db'
import { createToken, createUserProfile } from '../lib/developer'
import { getCurrentUserId } from '../store/UserProvider'
import { styled } from '../theme'

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

export const DeveloperMenu = () => (
  <React.Fragment>
    <DropdownAction
      onClick={async () => {
        const db = await databaseCreator
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
      <PlainLink href={`${config.api.url}/app/version`}>API version</PlainLink>
    </DropdownInfo>
  </React.Fragment>
)

export const DeveloperActions = () => (
  <React.Fragment>
    <DropdownAction
      onClick={() => {
        createToken('demo@example.com')
        alert('Created token')
      }}
    >
      Create token
    </DropdownAction>

    <DropdownAction
      onClick={async () => {
        createToken('demo@example.com')

        const userId = getCurrentUserId()

        await createUserProfile(userId as string, {
          given: 'Example',
          family: 'User',
        })

        alert('Created user profile')
      }}
    >
      Create user profile
    </DropdownAction>
  </React.Fragment>
)
