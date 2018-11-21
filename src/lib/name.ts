import { BibliographicName } from '@manuscripts/manuscripts-json-schema'

export const initials = (name: BibliographicName): string =>
  name.given
    ? name.given
        .split(' ')
        .map(part => part.substr(0, 1).toUpperCase() + '.')
        .join('')
    : ''
