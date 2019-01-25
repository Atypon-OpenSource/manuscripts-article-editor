import { Project } from '@manuscripts/manuscripts-json-schema'

const projects: Project[] = [
  {
    _id: 'project-1',
    objectType: 'MPProject',
    title: 'An example project',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    owners: ['user_1'],
    writers: [],
    viewers: [],
  },

  {
    _id: 'project-2',
    objectType: 'MPProject',
    title: 'Another example project',
    createdAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    owners: ['user_3'],
    writers: ['user_1'],
    viewers: ['user_2'],
  },
  {
    _id: 'project-3',
    objectType: 'MPProject',
    createdAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-02-22T08:00:00Z').getTime() / 1000),
    owners: ['user_2'],
    writers: [],
    viewers: ['user_1', 'user_3'],
  },
]

export default projects

export const project = projects[0]
