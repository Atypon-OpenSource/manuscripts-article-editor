import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Model } from '../../../types/models'
import { Decoder } from '../../decode'

export const createTestModelMap = (): Map<string, Model> => {
  const modelMap: Map<string, Model> = new Map()

  for (const component of projectDump.data as Model[]) {
    modelMap.set(component._id, component)
  }

  return modelMap
}

export const createTestDoc = () => {
  const modelMap = createTestModelMap()

  const decoder = new Decoder(modelMap)

  return decoder.createArticleNode()
}
