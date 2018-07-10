import { importItems, importJSON } from '../importers'
import data from './data/example-manuscript.json'
import { MockFile, MockReader } from './mock-file-reader'

describe('import', () => {
  it('importing JSON succeeds', async () => {
    // tslint:disable-next-line:no-any
    const file: any = new MockFile(__dirname + '/data/example-manuscript.json')
    // tslint:disable-next-line:no-any
    const reader: any = new MockReader()
    const items = await importJSON(file as File, reader)
    expect(items.length).toEqual(114)
    // tslint:disable-next-line:no-any
    expect(items.every((x: any) => x._id === null))
    // tslint:disable-next-line:no-any
    expect(items.every((x: any) => x._rev === null))
    // tslint:disable-next-line:no-any
    expect(items.every((x: any) => x.collection === null))
  })

  it('importing JSON succeeds', () => {
    const items = importItems(data)
    expect(items.length).toEqual(114)
  })
})
