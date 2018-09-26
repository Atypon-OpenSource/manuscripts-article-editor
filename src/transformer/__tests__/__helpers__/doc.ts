import components from '../../../../stories/data/components.json'
import { AnyComponent } from '../../../types/components'
import { Decoder } from '../../decode'

const createTestComponentMap = (): Map<string, AnyComponent> => {
  const componentMap = new Map()

  for (const component of components) {
    componentMap.set(component.id, component)
  }

  return componentMap
}

export const createTestDoc = () => {
  const componentMap = createTestComponentMap()

  const decoder = new Decoder(componentMap)

  return decoder.createArticleNode()
}
