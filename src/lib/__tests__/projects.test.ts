import { Project } from '@manuscripts/manuscripts-json-schema'
import { projectListCompare } from '../projects'

const createdAt = (date: string) => Math.floor(new Date(date).getTime() / 1000)

describe('projects', () => {
  test('projectListCompare', () => {
    const roles = {
      owners: [],
      writers: [],
      viewers: [],
    }

    const projects: Project[] = [
      {
        _id: 'project-1a',
        objectType: 'MPProject',
        title: 'Project 1',
        createdAt: createdAt('2018-01-28T08:00:00Z'),
        updatedAt: createdAt('2018-01-28T08:00:00Z'),
        ...roles,
      },
      {
        _id: 'project-1b',
        objectType: 'MPProject',
        title: 'Project 1',
        createdAt: createdAt('2018-01-22T08:00:00Z'),
        updatedAt: createdAt('2018-01-22T08:00:00Z'),
        ...roles,
      },
      {
        _id: 'project-2',
        objectType: 'MPProject',
        title: 'Project 2',
        createdAt: createdAt('2018-01-24T08:00:00Z'),
        updatedAt: createdAt('2018-01-26T08:00:00Z'),
        ...roles,
      },
    ]

    const result = [projects[2], projects[1], projects[0]].sort(
      projectListCompare
    )

    expect(result).toEqual(projects)
  })
})
