import { extname } from 'path'

// tslint:disable:no-any

// TODO: Replace with a type from manuscripts-json-schema.
interface Identifiable {
  id: string
  objectType: string
}

type Importer = (file: File, reader: FileReader) => Promise<Identifiable[]>

interface Importers {
  [key: string]: Importer
}

export const importJSON: Importer = (file, reader) => {
  return new Promise(resolve => {
    reader.addEventListener('load', async () => {
      const data = JSON.parse(reader.result)
      const items = Object.values(Object.values(data))
        .filter((item: any) => item._id || !item.id)
        .map((item: any) => {
          if (!item.id) {
            item.id = item._id
          }
          delete item._id
          delete item._rev
          delete item.collection
          return item as Identifiable
        })
      resolve(items)
    })
    reader.readAsText(file, 'UTF-8')
  })
}

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

export const importFile = /* istanbul ignore next */ async (file: File) => {
  return importers[extname(file.name)](file, new FileReader())
}
