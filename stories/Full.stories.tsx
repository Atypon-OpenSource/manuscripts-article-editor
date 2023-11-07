/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */
import { storiesOf } from '@storybook/react'
import React from 'react'

import { ManuscriptEditorApp, ParentObserver } from '../src'

storiesOf('Full', module).add('default', () => (
  <ManuscriptEditorApp
    fileManagement={{
      upload: (f) => {
        return Promise.resolve({
          id: 'test',
          type: {
            id: 'figure',
          },
          name: f.name,
          link: '',
          createdDate: new Date(),
        })
      },
      download: () => {
        return Promise.resolve(true)
      },
      previewLink: (f) => {
        return ''
      },
    }}
    files={[]}
    parentObserver={new ParentObserver()}
    permittedActions={[]}
    manuscriptID={'MPManuscript:B3BB2CD8-F944-47C3-9F01-1996DBD417EE'}
    projectID={'MPProject:ADC69637-C321-4158-8E24-F92068D4727D'}
  />
))
