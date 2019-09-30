/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { RxDatabase } from '@manuscripts/rxdb'
import React from 'react'
import { Collections } from '../collections'
import { DatabaseError } from '../sync/DatabaseError'

export type Database = RxDatabase<Collections>

// tslint:disable-next-line:no-object-literal-type-assertion
export const DatabaseContext = React.createContext<Database>({} as Database)

export interface DatabaseProps {
  db: Database
}

export const withDatabase = <Props extends DatabaseProps>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, keyof DatabaseProps>> => (props: Props) => (
  <DatabaseContext.Consumer>
    {value => <Component {...props} db={value} />}
  </DatabaseContext.Consumer>
)

interface Props {
  databaseCreator: Promise<Database>
}

interface State {
  db?: Database
  error?: Error
}

class DatabaseProvider extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    try {
      const db = await this.props.databaseCreator
      this.setState({ db })
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({ error })
    }
  }

  public render() {
    const { db, error } = this.state

    if (error) {
      return <DatabaseError />
    }

    if (!db) {
      return null
    }

    return (
      <DatabaseContext.Provider value={db}>
        {this.props.children}
      </DatabaseContext.Provider>
    )
  }
}

export default DatabaseProvider
