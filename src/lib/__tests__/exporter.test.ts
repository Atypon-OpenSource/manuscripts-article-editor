jest.mock('../pressroom')

import data from '@manuscripts/examples/data/project-dump.json'
import JSZip from 'jszip'
import { Paragraph } from '../../types/components'
import {
  exportProject,
  generateAttachmentFilename,
  generateDownloadFilename,
  removeEmptyStyles,
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

  test('removes empty properties', () => {
    const componentMap = buildComponentMap(data)

    const component = componentMap.get(
      'MPParagraphElement:05A0ED43-8928-4C69-A17C-0A98795001CD'
    ) as Paragraph

    expect(component.paragraphStyle).toBe(
      'MPParagraphStyle:7EAB5784-717B-4672-BD59-8CA324FB0637'
    )
    component.paragraphStyle = ''

    removeEmptyStyles(component)

    expect(component.paragraphStyle).toBeUndefined()
  })

  test('exports a manuscript', async () => {
    const componentMap = buildComponentMap(data)
    const manuscriptID = 'MPManuscript:8EB79C14-9F61-483A-902F-A0B8EF5973C9'
    const anotherManuscript: any = { // tslint:disable-line:no-any
      _rev: 'someRev',
      createdAt: 1538472121.690101,
      id: 'MPManuscript:TEST',
      objectType: 'MPManuscript',
      sessionID: 'fb8b3d44-9515-4747-c7d8-a30fb1bc188b',
      title: 'Example Manuscript',
      updatedAt: 1538472121.690101
    }

    componentMap.set(anotherManuscript.id, anotherManuscript)

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(componentMap, manuscriptID, 'docx')
    expect(result).toBeInstanceOf(Blob)

    const zip = await new JSZip().loadAsync(result)
    const manuscript = await readManuscriptFromBundle(zip)

    expect(manuscript.version).toBe('2.0')
    expect(manuscript.data).toHaveLength(137)
    expect(manuscript).toMatchSnapshot('exported-manuscript')
  })
})
