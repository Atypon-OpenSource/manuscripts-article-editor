import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Decoder } from '../../src/transformer'
import { Model } from '../../src/types/models'

export const modelMap = new Map()

projectDump.data.forEach((model: Model) => {
  modelMap.set(model._id, model)
})

const decoder = new Decoder(modelMap)

export const doc = decoder.createArticleNode()
