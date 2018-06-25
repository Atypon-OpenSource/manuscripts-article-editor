import { RxDocument } from 'rxdb'
import { BibliographyItem } from './components'

export type LibraryDocument = RxDocument<BibliographyItem>

type Fetch = (item: BibliographyItem) => Promise<Partial<BibliographyItem>>

type Search = (
  query: string,
  limit: number
) => Promise<Array<Partial<BibliographyItem>>>

export interface LibrarySource {
  id: string
  name: string
  fetch?: Fetch
  search?: Search
}
