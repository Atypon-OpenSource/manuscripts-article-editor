jest.mock('../lib/token')
jest.mock('../lib/deviceId')

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
  storyKindRegex: /^(ApplicationMenu|Button|Forms|Menu|Page)$/,
  test: renderOnly,
})
