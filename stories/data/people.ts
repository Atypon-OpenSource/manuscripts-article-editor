import { Person } from '../../src/types/person'

import * as imageFile from '../assets/melnitz.jpg'

const people: Person[] = [
  {
    id: 'example-1',
    name: 'Janine',
    surname: 'Melnitz',
    email: 'janine.melnitz@example.com',
    tel: '+1 800 555-2368',
    image: imageFile,
    affiliations: [
      {
        id: 'firehouse',
        name: 'Firehouse, Hook & Ladder Company 8',
        address:
          '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
      },
    ],
  },
  {
    id: 'example-2',
    name: 'Janine',
    surname: 'Melnitz',
    email: 'janine.melnitz@example.com',
    tel: '+1 800 555-2368',
    image: imageFile,
    affiliations: [
      {
        id: 'firehouse',
        name: 'Firehouse, Hook & Ladder Company 8',
        address:
          '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
      },
    ],
  },
  {
    id: 'example-3',
    name: 'Janine',
    surname: 'Melnitz',
    email: 'janine.melnitz@example.com',
    tel: '+1 800 555-2368',
    image: imageFile,
    affiliations: [
      {
        id: 'firehouse',
        name: 'Firehouse, Hook & Ladder Company 8',
        address:
          '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
      },
    ],
  },
]

export default people
