export const components = {
  title: 'components schema',
  version: 0,
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
    title: {
      type: 'string',
    },
    given: {
      type: 'string',
    },
    family: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    tel: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    priority: {
      type: 'number',
    },
    path: {
      type: 'array',
    },
    elementIDs: {
      type: 'array',
    },
    originalURL: {
      type: 'string',
    },
    contents: {
      type: 'string',
    },
    paragraphStyle: {
      type: 'string',
    },
    containedObjectIDs: {
      type: 'array',
    },
    containedObjectID: {
      type: 'string',
    },
    caption: {
      type: 'string',
    },
    // bibliographicName: {
    //   type: 'object'
    // }
  },
  required: ['objectType'],
}

export const people = {
  title: 'people schema',
  version: 0,
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
