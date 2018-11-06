import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Decoder } from '@manuscripts/manuscript-editor'
import { Model } from '@manuscripts/manuscripts-json-schema'

export const modelMap = new Map()

projectDump.data.forEach((model: Model) => {
  modelMap.set(model._id, model)
})

const decoder = new Decoder(modelMap)

export const doc = decoder.createArticleNode()
