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

// eslint-disable-next-line jest/no-mocks-import
import '../../src/lib/__mocks__/adapter'

import { addDecorator, configure } from '@storybook/react'
import React from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { MemoryRouter } from 'react-router-dom'

import IntlProvider from '../../src/components/IntlProvider'
import { ModalProvider } from '../../src/components/ModalProvider'
import { GlobalStyle } from '../../src/theme/theme'
import { ThemeProvider } from '../../src/theme/ThemeProvider'
import { Story } from '../components/Story'

addDecorator((story) => (
  <DndProvider backend={HTML5Backend}>
    <IntlProvider>
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <ModalProvider>
            <Story>
              <GlobalStyle suppressMultiMountWarning={true} />
              <div>{story()}</div>
            </Story>
          </ModalProvider>
        </MemoryRouter>
      </ThemeProvider>
    </IntlProvider>
  </DndProvider>
))

const req = require.context('..', true, /\.stories\.tsx/)

configure(() => {
  req.keys().forEach((filename) => req(filename))
}, module)
