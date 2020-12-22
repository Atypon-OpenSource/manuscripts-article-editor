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

import { AnyValidationResult } from '@manuscripts/requirements'

export const validationData: AnyValidationResult[] = [
  {
    type: 'section-order',
    severity: 0,
    passed: true,
    data: {
      order: [],
    },
    fix: true,
    objectType: 'MPSectionOrderValidationResult',
    _id: 'MPSectionOrderValidationResult:FCD54873-BAD0-488E-96C8-D1ECA23DD1F4',
    message: 'Sections must be listed in the following order Abstract',
  },
  {
    type: 'section-body-has-content',
    passed: false,
    severity: 0,
    data: {
      id: 'MPSection:6383A9BC-CB0E-4B0E-BB3A-31E0B5143256',
      sectionCategory: 'MPSectionCategory:abstract',
    },
    fix: true,
    objectType: 'MPSectionBodyValidationResult',
    _id: 'MPSectionBodyValidationResult:2C772412-BA8C-46A4-B0D6-DFDC8BCB793A',
    message: 'Abstract section must contains content',
  },
]
