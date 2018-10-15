import projectDump from '@manuscripts/examples/data/project-dump.json'
import { AnyComponent } from '../../../types/components'
import { Decoder } from '../../decode'

export const createTestComponentMap = (): Map<string, AnyComponent> => {
  const componentMap: Map<string, AnyComponent> = new Map()

  for (const component of projectDump.data as AnyComponent[]) {
    componentMap.set(component._id, component)
  }

  return componentMap
}

export const createTestDoc = () => {
  const componentMap = createTestComponentMap()

  const decoder = new Decoder(componentMap)

  return decoder.createArticleNode()
}
