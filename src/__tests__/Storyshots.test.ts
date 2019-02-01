jest.mock('../lib/token')
jest.mock('../lib/adapter')
jest.mock('../lib/device-id')

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
  test: renderOnly,
})
