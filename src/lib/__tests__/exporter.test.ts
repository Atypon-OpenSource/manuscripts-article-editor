jest.mock('../pressroom')

import JSZip from 'jszip'
import data from '../__fixtures__/example-manuscript.json'
import {
  exportProject,
  generateAttachmentFilename,
  generateDownloadFilename,
} from '../exporter'
import { readManuscriptFromBundle } from '../importers'
import { buildComponentMap } from './util'

describe('exporter', () => {
  test('generates a filename for an attachment', () => {
    const result = generateAttachmentFilename('MPFigure:1234-ABCD-EFGH-1234')
    expect(result).toBe('MPFigure_1234-ABCD-EFGH-1234')
  })

  test('generates a filename for a manuscript title', () => {
    const result = generateDownloadFilename('An example manuscript')
    expect(result).toBe('AnExampleManuscript')
  })

  test('generates a filename for a manuscript title with markup', () => {
    const result = generateDownloadFilename('An <b>example</b> manuscript')
    expect(result).toBe('AnExampleManuscript')
  })

  test('exports a manuscript', async () => {
    const componentMap = buildComponentMap(data)

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(componentMap, 'docx')
    expect(result).toBeInstanceOf(Blob)
    expect(result.size).toBe(17002)

    const zip = await new JSZip().loadAsync(result)
    const manuscript = await readManuscriptFromBundle(zip)

    expect(manuscript.version).toBe('2.0')
    expect(manuscript.data).toHaveLength(33)
    expect(manuscript).toMatchSnapshot('exported-manuscript')
  })
})
