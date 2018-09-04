import { Decoder } from '../../src/transformer'
import { AnyComponent } from '../../src/types/components'
import components from './components.json'

const componentMap = new Map()

components.forEach((component: AnyComponent) => {
  componentMap.set(component.id, component)
})

const decoder = new Decoder(componentMap)
export const doc = decoder.createArticleNode()
