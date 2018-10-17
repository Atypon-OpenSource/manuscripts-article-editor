import { Model } from '../../types/models'
import { ProjectDump } from '../importers'

export const buildModelMap = (doc: ProjectDump): Map<string, Model> => {
  const output: Map<string, Model> = new Map()

  doc.data.forEach(item => {
    output.set(item._id, item)
  })

  return output
}
