import { Person } from '../../src/types/components'

import * as imageFile from '../assets/melnitz.jpg'

const people: Person[] = [
  {
    id: 'example-1',
    objectType: 'MPPerson',
    name: 'Janine',
    surname: 'Melnitz',
    email: 'janine.melnitz@example.com',
    tel: '+1 800 555-2368',
    image: imageFile,
    affiliations: [
      {
        id: 'firehouse',
        objectType: 'MPAffiliation',
        name: 'Firehouse, Hook & Ladder Company 8',
        address:
          '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
      },
    ],
  },
  {
    id: 'example-2',
    objectType: 'MPPerson',
    name: 'Janine',
    surname: 'Melnitz',
    email: 'janine.melnitz@example.com',
    tel: '+1 800 555-2368',
    image: imageFile,
    affiliations: [
      {
        id: 'firehouse',
        objectType: 'MPAffiliation',
        name: 'Firehouse, Hook & Ladder Company 8',
        address:
          '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
      },
    ],
  },
  {
    id: 'example-3',
    objectType: 'MPPerson',
    name: 'Janine',
    surname: 'Melnitz',
    email: 'janine.melnitz@example.com',
    tel: '+1 800 555-2368',
    image: imageFile,
    affiliations: [
      {
        id: 'firehouse',
        objectType: 'MPAffiliation',
        name: 'Firehouse, Hook & Ladder Company 8',
        address:
          '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
      },
    ],
  },
]

export default people
