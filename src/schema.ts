export const components = {
  title: 'components schema',
  version: 0,
  disableKeyCompression: true,
  description: 'describes a component',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    manuscript: {
      type: 'string',
    },
    objectType: {
      type: 'string',
    },
    elementType: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: ['objectType'],
}

export const people = {
  title: 'people schema',
  version: 0,
  disableKeyCompression: true,
  description: 'describes a person',
  type: 'object',
  properties: {
    objectType: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    surname: {
      type: 'string',
    },
  },
  required: ['name'],
}

export const groups = {
  title: 'groups schema',
  version: 0,
  disableKeyCompression: true,
  description: 'describes a group',
  type: 'object',
  properties: {
    objectType: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  required: ['name'],
}
