export interface Affiliation {
  _id: string
  name: string
  address?: string
}

export interface Person {
  _id: string
  name: string
  surname: string
  email?: string
  tel?: string
  image?: string
  affiliations: Affiliation[] | undefined
}
