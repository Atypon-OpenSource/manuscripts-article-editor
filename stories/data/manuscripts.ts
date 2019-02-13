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

import { Manuscript } from '@manuscripts/manuscripts-json-schema'

const manuscripts: Manuscript[] = [
  {
    _id: 'example-1',
    containerID: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    bundle: 'MPBundle:www-zotero-org-styles-apa-5th-edition',
    primaryLanguageCode: 'en-GB',
  },

  {
    _id: 'example-2',
    containerID: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Two complement receptor one alleles have opposing associations with cerebral malaria and interact with α<sup>+</sup>thalassaemia',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    bundle: 'MPBundle:www-zotero-org-styles-nature',
    primaryLanguageCode: 'en-US',
  },

  {
    _id: 'example-3',
    containerID: 'project-1',
    objectType: 'MPManuscript',
    title:
      'Cryo-EM structure of the adenosine A<sub>2A</sub> receptor coupled to an engineered heterotrimeric G protein',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    bundle: 'MPBundle:www-zotero-org-styles-peerj',
    primaryLanguageCode: 'ar',
  },
]

export default manuscripts

export const manuscript = manuscripts[0]
