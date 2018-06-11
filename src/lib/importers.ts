import { extname } from 'path'
import { AnyComponent } from '../types/components'

type Importer = (file: File) => Promise<AnyComponent[]>

interface Importers {
  [key: string]: Importer
}

const importJSON: Importer = file =>
  new Promise(resolve => {
    const reader = new FileReader()

    reader.addEventListener('load', async () => {
      const data = JSON.parse(reader.result)

      const items: AnyComponent[] = []

      for (const section of Object.values(data)) {
        for (const item of Object.values(section)) {
          if (!item._id && !item.id) continue

          // TODO: generate a new ID for each object while maintaining references between objects?
          if (!item.id) {
            item.id = item._id
          }

          delete item._id
          delete item._rev
          delete item.collection

          items.push(item)
        }
      }

      resolve(items)
    })

    reader.readAsText(file, 'UTF-8')
  })

export const importers: Importers = {
  '.manuscript-json': importJSON,
}

export const openFilePicker = () =>
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

export const importFile = async (file: File) => {
  return importers[extname(file.name)](file)
}
