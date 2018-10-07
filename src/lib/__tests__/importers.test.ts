jest.mock('../pressroom')

import data from '@manuscripts/examples/data/project-dump.json'
import { exportProject } from '../exporter'
import { importFile, openFilePicker } from '../importers'
import { buildComponentMap } from './util'

// tslint:disable:no-any

const createFile = (format: string): File => {
  switch (format) {
    case '.docx': {
      const blob = new Blob([], {
        type:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      return new File([blob], 'example.docx')
    }

    case '.md': {
      const blob = new Blob([], {
        type: 'application/markdown',
      })

      return new File([blob], 'example.md')
    }

    default:
      throw new Error('Unknown format: ' + format)
  }
}

describe('Import', () => {
  test('Receive a file from a file picker', async () => {
    jest
      .spyOn(document, 'createElement')
      .mockImplementationOnce((tagName: string) => {
        expect(tagName).toBe('input')

        const element = document.createElement(tagName) as HTMLInputElement

        jest.spyOn(element, 'click').mockImplementation(() => {
          Object.defineProperty(element, 'files', {
            get: () => [createFile('.docx')],
          })

          element.dispatchEvent(new Event('change'))
        })

        return element
      })

    const file = await openFilePicker()

    expect(file.name).toBe('example.docx')
  })

  test('Receive no files from a file picker', async () => {
    jest
      .spyOn(document, 'createElement')
      .mockImplementationOnce((tagName: string) => {
        expect(tagName).toBe('input')

        const element = document.createElement(tagName) as HTMLInputElement

        jest.spyOn(element, 'click').mockImplementation(() => {
          element.dispatchEvent(new Event('change'))
        })

        return element
      })

    await expect(openFilePicker()).rejects.toThrowError('No file was received')
  })

  test('Import a manuscript from a DOCX file', async () => {
    const componentMap = buildComponentMap(data)

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(componentMap, 'docx')

    const file = new File([result], 'manuscript.docx', {
      type:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      lastModified: Date.now(),
    })

    const items = await importFile(file)

    items.forEach((item: any) => expect(item.id).toBeDefined())
    items.forEach((item: any) => expect(item.objectType).toBeDefined())
    items.forEach((item: any) => expect(item._id).toBeUndefined())
    items.forEach((item: any) => expect(item._rev).toBeUndefined())
    items.forEach((item: any) => expect(item.collection).toBeUndefined())
  })
})
