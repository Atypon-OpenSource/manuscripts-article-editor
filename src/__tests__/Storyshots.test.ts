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

import 'whatwg-fetch'

import initStoryshots, {
  Stories2SnapsConverter,
} from '@storybook/addon-storyshots'
import { act, create } from 'react-test-renderer'

jest.mock('lodash-es', () => {
  const original = jest.requireActual('lodash-es')

  return {
    ...original,
    sample: (items: unknown[]) => items[0],
  }
})

jest.mock('../lib/token')
jest.mock('../lib/adapter')
jest.mock('../lib/device-id')

jest.mock('../config', () => {
  const { default: original } = jest.requireActual('../config')

  return {
    ...original,
    git: {
      version: 'test',
      commit: 'test',
    },
  }
})

const converter = new Stories2SnapsConverter()

initStoryshots({
  configPath: 'stories/config',
  asyncJest: true,
  test: async ({ story, context, done }) => {
    const filename = converter.getSnapshotFileName(context)

    if (!filename) {
      return
    }

    // render the component
    const renderer = create(story.render())

    // wait for state changes
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    // eslint-disable-next-line jest/no-standalone-expect
    expect(renderer.toJSON()).toMatchSpecificSnapshot(filename)

    renderer.unmount()

    done()
  },
})
