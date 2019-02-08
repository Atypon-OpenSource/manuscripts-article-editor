import {
  buildProject,
  ContainedModel,
  isManuscriptModel,
  ManuscriptModel,
  ModelAttachment,
} from '@manuscripts/manuscript-editor'
import {
  Manuscript,
  Model,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema/dist/types'
import { History } from 'history'
import { BulkCreateError } from '../../lib/errors'
import { isManuscript, nextManuscriptPriority } from '../../lib/manuscript'
import { getCurrentUserId } from '../../lib/user'
import { Collection, isBulkDocsError } from '../../sync/Collection'
import CollectionManager from '../../sync/CollectionManager'
import { Database } from '../DatabaseProvider'

export const importManuscript = (
  db: Database,
  history: History,
  user?: UserProfile,
  handleComplete?: () => void,
  possibleProjectID?: string
  // tslint:disable-next-line:cyclomatic-complexity
) => async (models: Model[]) => {
  const userID = user ? user.userID : getCurrentUserId()!

  const newProject = possibleProjectID ? null : buildProject(userID)

  const projectID = newProject ? newProject._id : possibleProjectID!

  const collection = await createProjectCollection(db, projectID)

  if (newProject) {
    const projectsCollection = openProjectsCollection()
    await projectsCollection.create(newProject)
  }

  const manuscript = models.find(isManuscript)

  if (!manuscript) {
    throw new Error('No manuscript found')
  }

  manuscript.priority = await nextManuscriptPriority(collection as Collection<
    Manuscript
  >)

  // TODO: save dependencies first, then the manuscript
  // TODO: handle multiple manuscripts in a project bundle

  const items = models.map(model => ({
    ...model,
    containerID: projectID,
    manuscriptID: isManuscriptModel(model) ? manuscript._id : undefined,
  }))

  const results = await collection.bulkCreate(items)

  for (const model of models as Array<Model & ModelAttachment>) {
    if (model.attachment) {
      await collection.attach(model._id, model.attachment)
    }
  }

  const failures = results.filter(isBulkDocsError)

  if (failures.length) {
    throw new BulkCreateError(failures)
  }

  history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

  if (handleComplete) {
    handleComplete()
  }
}

export const createProjectCollection = (db: Database, projectID: string) =>
  CollectionManager.createCollection<ContainedModel | ManuscriptModel>({
    collection: `project-${projectID}`,
    channels: [`${projectID}-read`, `${projectID}-readwrite`],
    db,
  })

export const openProjectsCollection = () =>
  CollectionManager.getCollection<Project>('user' /* 'projects' */)
