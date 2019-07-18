/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

jest.mock('../pressroom')

import data from '@manuscripts/examples/data/project-dump.json'
import { ManuscriptModel } from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  ParagraphElement,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import {
  downloadExtension,
  exportProject,
  generateDownloadFilename,
  removeEmptyStyles,
} from '../exporter'
import { ProjectDump, readManuscriptFromBundle } from '../importers'
import { buildModelMap } from './util'

describe('exporter', () => {
  test('generates a filename for a manuscript title', () => {
    const result = generateDownloadFilename('An example manuscript')
    expect(result).toBe('AnExampleManuscript')
  })

  test('generates a filename for a manuscript title with markup', () => {
    const result = generateDownloadFilename('An <b>example</b> manuscript')
    expect(result).toBe('AnExampleManuscript')
  })

  test('downloadExtension', () => {
    const result = downloadExtension('.docx')
    expect(result).toEqual('.docx')
  })

  test('downloadExtension', () => {
    const result = downloadExtension('.doc')
    expect(result).toEqual('.zip')
  })

  test('removes empty properties', () => {
    const modelMap = buildModelMap(data)

    const model = modelMap.get(
      'MPParagraphElement:05A0ED43-8928-4C69-A17C-0A98795001CD'
    ) as ParagraphElement

    expect(model.paragraphStyle).toBe(
      'MPParagraphStyle:7EAB5784-717B-4672-BD59-8CA324FB0637'
    )
    model.paragraphStyle = ''

    removeEmptyStyles(model)

    expect(model.paragraphStyle).toBeUndefined()
  })

  test('exports a manuscript as docx', async () => {
    const modelMap = buildModelMap(data as ProjectDump)
    const manuscriptID = 'MPManuscript:8EB79C14-9F61-483A-902F-A0B8EF5973C9'

    const anotherManuscript: Partial<Manuscript> = {
      _id: 'MPManuscript:TEST',
      _rev: 'someRev',
      createdAt: 1538472121.690101,
      objectType: 'MPManuscript',
      sessionID: 'fb8b3d44-9515-4747-c7d8-a30fb1bc188b',
      title: 'Example Manuscript',
      updatedAt: 1538472121.690101,
    }

    modelMap.set(
      (anotherManuscript as Manuscript)._id,
      anotherManuscript as Manuscript
    )

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(modelMap, manuscriptID, '.docx')
    expect(result).toBeInstanceOf(Blob)

    const zip = await new JSZip().loadAsync(result)
    const manuscript = await readManuscriptFromBundle(zip)

    expect(manuscript.version).toBe('2.0')
    expect(manuscript.data).toHaveLength(137)
    expect(manuscript).toMatchSnapshot('exported-manuscript')
  })

  test('exports a manuscript as manuproj', async () => {
    const modelMap = buildModelMap(data as ProjectDump)
    const manuscriptID = 'MPManuscript:8EB79C14-9F61-483A-902F-A0B8EF5973C9'

    const anotherManuscript: Partial<Manuscript> = {
      _id: 'MPManuscript:TEST',
      _rev: 'someRev',
      createdAt: 1538472121.690101,
      objectType: 'MPManuscript',
      sessionID: 'fb8b3d44-9515-4747-c7d8-a30fb1bc188b',
      title: 'Example Manuscript',
      updatedAt: 1538472121.690101,
    }

    const project: Project = {
      _id: 'MPProject:TEST',
      title: 'Example Project',
      createdAt: 0,
      updatedAt: 0,
      objectType: 'MPProject',
      owners: ['owner@example.com'],
      writers: [],
      viewers: [],
    }

    modelMap.set(
      (anotherManuscript as Manuscript)._id,
      anotherManuscript as Manuscript
    )

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(
      modelMap,
      manuscriptID,
      '.manuproj',
      project
    )
    expect(result).toBeInstanceOf(Blob)

    const zip = await new JSZip().loadAsync(result)
    const json = await zip.file('containers.json').async('text')

    const containers = JSON.parse(json)
    expect(containers).toHaveLength(1)

    const [container] = containers
    expect(container._id).toEqual(project._id)

    // const manuscript = await readManuscriptFromBundle(zip)
    // expect(manuscript.data).toHaveLength(138)
  })

  test('removes container ids', async () => {
    const modelMap = buildModelMap(data as ProjectDump)
    const manuscriptID = 'MPManuscript:8EB79C14-9F61-483A-902F-A0B8EF5973C9'

    for (const [key, value] of modelMap.entries()) {
      const model = value as ManuscriptModel
      model.containerID = 'MPProject:1'
      model.manuscriptID = 'MPManuscript:1'
      modelMap.set(key, model)
    }

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(modelMap, manuscriptID, '.docx')
    expect(result).toBeInstanceOf(Blob)

    const zip = await new JSZip().loadAsync(result)
    const bundle = await readManuscriptFromBundle(zip)

    for (const value of bundle.data) {
      const model = value as ManuscriptModel
      expect(model.containerID).toBeUndefined()
      expect(model.manuscriptID).toBeUndefined()
    }
  })
})
