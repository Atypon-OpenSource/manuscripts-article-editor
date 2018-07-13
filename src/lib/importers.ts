import { extname } from 'path'
import { Component } from '../types/components'

type Importer = (file: File) => Promise<Component[]>

interface Importers {
  [key: string]: Importer
}

interface JsonComponent extends Component {
  _id: string
  collection: string
}

interface ManuscriptsSection {
  [key: string]: JsonComponent
}

interface ManuscriptsDocument {
  [key: string]: ManuscriptsSection
}

// TODO: generate a new ID for each object while maintaining references between objects

const importItems = (data: ManuscriptsDocument): Component[] =>
  Object.values(data)
    .map(section => Object.values(section))
    .reduce((a, b) => a.concat(b)) // flatten
    .filter(item => item._id || item.id)
    .map(item => {
      item.id = item.id || item._id

      delete item._id
      delete item._rev
      delete item.collection

      return item
    })

const importJSON: Importer = (file: File) =>
  new Promise(resolve => {
    const reader = new FileReader()

    reader.addEventListener('load', async () => {
      const data = JSON.parse(reader.result)
      const items = importItems(data)
      resolve(items)
    })

    reader.readAsText(file, 'UTF-8')
  })

const importers: Importers = {
  '.manuscript-json': importJSON,
}

export const openFilePicker = (): Promise<File> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = Object.keys(importers).join(',')
    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        resolve(input.files[0])
      } else {
        reject(new Error('No file was received'))
      }
    })
    input.click()
  })

export const importFile = async (file: File) =>
  importers[extname(file.name)](file)
