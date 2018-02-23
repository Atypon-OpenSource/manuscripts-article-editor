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

export const sections = {
  title: 'sections schema',
  version: 1,
  description: 'describes a section',
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    manuscript: {
      type: 'string',
    },
  },
  required: ['title'],
}

export const people = {
  title: 'people schema',
  version: 0,
  description: 'describes a person',
  type: 'object',
  properties: {
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
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  required: ['name'],
}
