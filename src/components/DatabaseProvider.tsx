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
      return error.name === 'RxError' ? (
        <DatabaseError />
      ) : (
        <div>{error.message}</div>
      )
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
