import { RxDatabase } from 'rxdb'

interface RxDB {
  removeDatabase: (name: string, adapter: string) => void
}

declare global {
  interface Window {
    RxDB: RxDB
    requestIdleCallback: (T: () => void, options: object) => string
    XMLSerializer: XMLSerializer
  }
}
