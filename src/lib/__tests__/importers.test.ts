import { importJSON } from '../importers'
import { MockFile, MockReader } from './mock-file-reader'

describe('import', () => {
  it('importing JSON succeeds', async () => {
    // tslint:disable-next-line:no-any
    const file: any = new MockFile(__dirname + '/example.manuscript-json')
    // tslint:disable-next-line:no-any
    const reader: any = new MockReader()
    const items = await importJSON(file as File, reader)
    expect(items.length).toEqual(17)
  })
})
