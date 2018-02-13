export const manuscripts = {
  title: 'manuscripts schema',
  version: 0,
  description: 'describes a manuscript',
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
  },
  required: ['title'],
}

export const collaborators = {
  title: 'collaborators schema',
  version: 0,
  description: 'describes a collaborator',
  type: 'object',
  properties: {
    name: {
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
    name: {
      type: 'string',
    },
  },
  required: ['name'],
}
