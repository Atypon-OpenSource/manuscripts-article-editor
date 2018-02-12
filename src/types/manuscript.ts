import { Person } from './person'

export interface ManuscriptInterface {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  authors: Person[] | undefined
}

export type PartialManuscriptInterface = Partial<ManuscriptInterface>
