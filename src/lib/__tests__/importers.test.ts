import { importFile, openFilePicker } from '../importers'
import data from './data/example-manuscript.json'

// tslint:disable:no-any

const createJSONFile = (): File => {
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  })

  return new File([blob], 'example.manuscript-json')
}

describe('Import', () => {
  test('Import a manuscript from a JSON file', async () => {
    const file = createJSONFile()

    const items = await importFile(file)

    expect(items.length).toEqual(114)

    items.forEach((item: any) => expect(item.id).toBeDefined())
    items.forEach((item: any) => expect(item.objectType).toBeDefined())
    items.forEach((item: any) => expect(item._id).toBeUndefined())
    items.forEach((item: any) => expect(item._rev).toBeUndefined())
    items.forEach((item: any) => expect(item.collection).toBeUndefined())
  })

  test('Receive a file from a file picker', async () => {
    jest
      .spyOn(document, 'createElement')
      .mockImplementationOnce((tagName: string) => {
        expect(tagName).toBe('input')

        const element = document.createElement(tagName) as HTMLInputElement

        jest.spyOn(element, 'click').mockImplementation(() => {
          Object.defineProperty(element, 'files', {
            get: () => [createJSONFile()],
          })

          element.dispatchEvent(new Event('change'))
        })

        return element
      })

    const file = await openFilePicker()

    expect(file.name).toBe('example.manuscript-json')
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
})
