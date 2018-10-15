import { RxJsonSchema } from 'rxdb'

export const projects: RxJsonSchema = {
  title: 'projects schema',
  version: 1,
  attachments: {},
  description: 'describes a component of a project',
  type: 'object',
  additionalProperties: true,
  properties: {
    _id: {
      type: 'string',
      primary: true,
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
    containerID: {
      type: 'string',
      index: true,
    },
    manuscriptID: {
      type: 'string',
      index: true,
    },
    bibliographicName: {
      type: 'object',
    },
  },
  required: ['objectType'],
}
