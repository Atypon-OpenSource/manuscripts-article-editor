export interface Affiliation {
  id: string
  name: string
  address?: string
}

export interface Person {
  id: string
  name: string
  surname: string
  email?: string
  tel?: string
  image?: string
  affiliations: Affiliation[] | undefined
}

export type PartialPerson = Partial<Person>
