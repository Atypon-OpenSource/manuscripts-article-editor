/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { RxDatabase } from 'rxdb'
import { Collections } from '../collections'
import { DatabaseError } from '../sync/DatabaseError'

export type Database = RxDatabase<Collections>

// tslint:disable-next-line:no-object-literal-type-assertion
export const DatabaseContext = React.createContext<Database>({} as Database)

export interface DatabaseProps {
  db: Database
}

export const withDatabase = <Props extends {}>(
  Component: React.ComponentType<DatabaseProps>
): React.ComponentType<Pick<Props, Exclude<keyof Props, DatabaseProps>>> => (
  props: Props
) => (
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
