import { extname } from 'path'
import { AnyComponent, Component } from '../types/components'

type Importer = (file: File, reader?: FileReader) => Promise<AnyComponent[]>

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

export const importItems = (data: ManuscriptsDocument): AnyComponent[] => {
  return Object.values(data)
    .map(section => Object.values(section))
    .reduce((a, b) => a.concat(b)) // flatten
    .filter(item => item._id || item.id)
    .map(item => {
      const out = { ...item }
      out.id = item.id || item._id
      delete out._id
      delete out._rev
      delete out.collection
      // tslint:disable-next-line:no-any
      return out as any
    })
}

export const importJSON: Importer = /* istanbul ignore next */ (
  file: File,
  reader: FileReader
) =>
  new Promise(resolve => {
    reader.addEventListener('load', async () => {
      const data = JSON.parse(reader.result)
      const items = importItems(data)
      resolve(items)
    })

    reader.readAsText(file, 'UTF-8')
  })

export const importers: Importers = {
  '.manuscript-json': importJSON,
}

export const openFilePicker = /* istanbul ignore next */ () =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = Object.keys(importers).join(',')
    input.addEventListener('change', event => {
      const input = event.target as HTMLInputElement

      if (input.files) {
        resolve(input.files[0])
      } else {
        reject()
      }
    })
    input.click()
  })

export const importFile = /* istanbul ignore next */ async (
  file: File,
  reader?: FileReader
) => {
  if (!reader) {
    reader = new FileReader()
  }
  return importers[extname(file.name)](file, reader)
}
