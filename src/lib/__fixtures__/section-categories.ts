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

import { SectionCategory } from '../../types/templates'

export const sectionCategories: SectionCategory[] = [
  {
    _id: 'MPSectionCategory:abstract',
    name: 'Abstract',
    desc: 'A short summary of your work.',
    objectType: 'MPSectionCategory',
    titles: ['abstract', 'summary', 'lead-in'],

    priority: 100,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPSectionCategory:author-summary',
    name: 'Author Summary',
    desc:
      'A non-technical summary of the work, typically immediately follows the abstract.',
    objectType: 'MPSectionCategory',
    priority: 150,
    titles: ['author summary', 'authorSummary'],
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPSectionCategory:keywords',
    name: 'Keywords',
    desc: 'List of keywords relevant to the manuscript.',
    objectType: 'MPSectionCategory',
    titles: ['Keywords', 'List of keywords'],
    priority: 175,
    createdAt: 0,
    updatedAt: 0,
  },
]
