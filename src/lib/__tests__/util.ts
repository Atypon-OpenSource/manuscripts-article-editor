import { ComponentMap } from '../../types/components'
import { ProjectDump } from '../importers'

export const buildComponentMap = (doc: ProjectDump): ComponentMap => {
  const output: ComponentMap = new Map()

  doc.data.forEach(item => {
    output.set(item._id, item)
  })

  return output
}
