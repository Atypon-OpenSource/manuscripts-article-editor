import { RxCollection, RxCollectionCreator } from 'rxdb'

// `string` has to be allowed for e.g. project-${projectID}
export type CollectionName =
  // | 'projects'
  | 'user'
  | 'collaborators'
  // | 'invitations'
  | string

type CollectionCreators = { [key in CollectionName]: RxCollectionCreator }

export type Collections = { [key in CollectionName]: RxCollection }

const basicProperties = {
  _id: {
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
}

export const collections: CollectionCreators = {
  /*projects: {
    name: 'projects',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
    },
  },*/
  user: {
    name: 'user',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },
  collaborators: {
    name: 'collaborators',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },
  /*invitations: {
    name: 'invitations',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },*/
  project: {
    name: 'project',
    schema: {
      version: 0,
      type: 'object',
      properties: basicProperties,
      required: ['objectType'],
      attachments: {},
    },
  },
}
