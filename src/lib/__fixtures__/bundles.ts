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

import { Bundle } from '@manuscripts/manuscripts-json-schema'

export const bundles: Bundle[] = [
  {
    _id: 'MPBundle:www-zotero-org-styles-nonlinear-dynamics',
    csl: {
      ISSNs: ['0924090X'],
      _id: 'MPCitationStyle:www-zotero-org-styles-nonlinear-dynamics',
      cslIdentifier: 'http://www.zotero.org/styles/nonlinear-dynamics',
      defaultLocale: 'en-US',
      'documentation-URL':
        'http://www.springer.com/cda/content/document/cda_downloaddocument/manuscript-guidelines-1.0.pdf',
      eISSNs: ['1573269X'],
      fields: ['MPResearchField:science'],
      'independent-parent-URL':
        'http://www.zotero.org/styles/springer-mathphys-brackets',
      license: 'http://creativecommons.org/licenses/by-sa/3.0/',
      'self-URL': 'http://www.zotero.org/styles/nonlinear-dynamics',
      title: 'Nonlinear Dynamics',
      updatedAt: 1400151600,
      version: '1.0',
    },
    objectType: 'MPBundle',
    scimago: {
      H: 46,
      I: '0924090X',
      R: 0.754,
      c: 'Netherlands',
      c3Y: 972,
      cib3Y: 535,
      d3Y: 583,
      dY: 260,
      muC2Y: 1.61,
      muR: 28.89,
      rY: 7512,
      t: 'Nonlinear Dynamics',
    },
    createdAt: 0,
    updatedAt: 0,
  },
]
