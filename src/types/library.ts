import { RxDocument } from 'rxdb'
import { BibliographyItem } from './components'

export type LibraryDocument = RxDocument<BibliographyItem>

type Fetch = (url: string) => Promise<BibliographyItem>
type Search = (query: string, limit: number) => Promise<BibliographyItem[]>

export interface LibrarySource {
  id: string
  name: string
  fetch?: Fetch
  search?: Search
}
