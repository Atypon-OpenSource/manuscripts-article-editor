import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Decoder } from '../../src/transformer'
import { AnyComponent } from '../../src/types/components'

export const componentMap = new Map()

projectDump.data.forEach((component: AnyComponent) => {
  componentMap.set(component.id, component)
})

const decoder = new Decoder(componentMap)

export const doc = decoder.createArticleNode()
