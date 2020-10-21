/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { AnyValidationResult } from '../../src/lib/validations'

export const validationData: AnyValidationResult[] = [
  {
    type: 'section-order',
    severity: 0,
    passed: true,
    data: {
      order: [],
    },
    containerID: 'MPProject:B81D5F33-6338-420C-AAEC-CF0CF33E675C',
    createdAt: 1601237242,
    manuscriptID: 'MPManuscript:9E0BEDBC-1084-4AA1-AB82-10ACFAE02232',
    sessionID: 'f0b3bf1b-4435-4829-84e9-4b8b3517b95c',
    updatedAt: 1601237242,
    fix: true,
    objectType: 'MPSectionOrderValidationResult',
    _id: 'MPSectionOrderValidationResult:B61347A5-C480-4A6E-ACFB-B8465AF21265',
  },
  {
    type: 'section-body-has-content',
    passed: true,
    severity: 0,
    containerID: 'MPProject:B81D5F33-6338-420C-AAEC-CF0CF33E675C',
    createdAt: 1601237242,
    manuscriptID: 'MPManuscript:9E0BEDBC-1084-4AA1-AB82-10ACFAE02232',
    sessionID: 'f0b3bf1b-4435-4829-84e9-4b8b3517b95c',
    updatedAt: 1601237242,
    data: {
      id: 'MPSection:86F9363B-EFE9-4999-8458-E703985621FE',
      sectionCategory: 'MPSectionCategory:cover-letter',
    },
    objectType: 'MPSectionBodyValidationResult',
    _id: 'MPSectionBodyValidationResult:F7483742-8AE0-4C32-AB87-D4C2564361FD',
  },
  {
    type: 'figure-format-validation',
    passed: false,
    containerID: 'MPProject:B81D5F33-6338-420C-AAEC-CF0CF33E675C',
    createdAt: 1601237242,
    manuscriptID: 'MPManuscript:9E0BEDBC-1084-4AA1-AB82-10ACFAE02232',
    sessionID: 'f0b3bf1b-4435-4829-84e9-4b8b3517b95c',
    updatedAt: 1601237242,
    data: {
      id: 'MPFigure:DCD7C921-7629-4E6C-9156-D28FBB4B9F96',
      contentType: 'image/png',
    },
    severity: 0,
    objectType: 'MPFigureFormatValidationResult',
    _id: 'MPFigureFormatValidationResult:76CC41A0-6B4C-447B-B381-49CFA6762ABE',
  },
  {
    type: 'figure-contains-image',
    passed: true,
    severity: 0,
    containerID: 'MPProject:B81D5F33-6338-420C-AAEC-CF0CF33E675C',
    createdAt: 1601237242,
    manuscriptID: 'MPManuscript:9E0BEDBC-1084-4AA1-AB82-10ACFAE02232',
    sessionID: 'f0b3bf1b-4435-4829-84e9-4b8b3517b95c',
    updatedAt: 1601237242,
    data: {
      id: 'MPFigure:DCD7C921-7629-4E6C-9156-D28FBB4B9F96',
    },
    objectType: 'MPFigureImageValidationResult',
    _id: 'MPFigureImageValidationResult:C771CEF6-ADFE-4EB1-941C-9150F3FAC5AE',
  },
]
