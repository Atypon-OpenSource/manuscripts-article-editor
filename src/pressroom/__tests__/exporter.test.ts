/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

jest.mock('../pressroom')

import data from '@manuscripts/examples/data/project-dump.json'
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
import { ProjectDump, readProjectDumpFromArchive } from '../importers'
import { getAttachment } from './attachments'
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

  test('generates a filename for a manuscript title with brackets', () => {
    const result = generateDownloadFilename(
      'Group ICA of fMRI Toolbox (GIFT) Tutorial'
    )
    expect(result).toBe('GroupICAOfFMRIToolboxGIFTTutorial')
  })

  test('generates a filename trimmed when too long', () => {
    // 299 chars
    const result = generateDownloadFilename(
      'This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this This this this this this'
    )
    expect(result.length).toBe(200)
  })

  test('downloadExtension', () => {
    const result = downloadExtension('docx')
    expect(result).toEqual('.docx')
  })

  test('downloadExtension zip', () => {
    const result = downloadExtension('jats')
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

    // NOTE: unable to test attachments as JSDOM doesn't yet support blob URLs
    //
    // for (const [key, model] of modelMap.entries()) {
    //   if (isFigure(model)) {
    //     model.src = URL.createObjectURL(
    //       new Blob(['test'], { type: 'image/png' })
    //     )
    //     modelMap.set(key, model)
    //   }
    // }

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(
      getAttachment,
      modelMap,
      manuscriptID,
      'docx'
    )
    expect(result).toBeInstanceOf(Blob)

    const zip = await new JSZip().loadAsync(result)
    const manuscript = await readProjectDumpFromArchive(zip)

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
      getAttachment,
      modelMap,
      manuscriptID,
      'manuproj',
      project
    )
    expect(result).toBeInstanceOf(Blob)

    const zip = await new JSZip().loadAsync(result)
    const json = await zip.files['containers.json'].async('text')

    const containers = JSON.parse(json)
    expect(containers).toHaveLength(1)

    const [container] = containers
    expect(container._id).toEqual(project._id)

    // const manuscript = await readProjectDumpFromArchive(zip)
    // expect(manuscript.data).toHaveLength(138)
  })
})
