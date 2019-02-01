import React from 'react'
import { Category, Dialog } from '../components/Dialog'
import { logout } from '../lib/account'

export const DatabaseError: React.FunctionComponent = () => (
  <Dialog
    isOpen={true}
    category={Category.error}
    header={'Database error'}
    message={'There was an unrecoverable error opening the local database.'}
    actions={{
      primary: {
        title: 'Sign out and try again',
        action: logout,
      },
    }}
  />
)
