import { RxJsonSchema } from 'rxdb/src/typings/rx-schema'

export const components: RxJsonSchema = {
  title: 'components schema',
  version: 0,
  disableKeyCompression: true,
  attachments: {},
  description: 'describes a component',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    manuscript: {
      type: 'string',
      index: true,
    },
    objectType: {
      type: 'string',
      index: true,
    },
    elementType: {
      type: 'string',
    },
    createdAt: {
      type: 'number',
      index: true,
    },
    updatedAt: {
      type: 'number',
      index: true,
    },
    bibliographicName: {
      type: 'object',
    },
  },
  required: ['objectType'],
}

export const shared: RxJsonSchema = {
  title: 'shared components schema',
  version: 0,
  disableKeyCompression: true,
  description: 'describes a shared component',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    objectType: {
      type: 'string',
      index: true,
    },
    createdAt: {
      type: 'number',
      index: true,
    },
    updatedAt: {
      type: 'number',
      index: true,
    },
  },
  required: ['objectType'],
}

export const people: RxJsonSchema = {
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

export const groups: RxJsonSchema = {
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
