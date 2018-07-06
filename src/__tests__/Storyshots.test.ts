jest.mock('../lib/token')
jest.mock('../lib/deviceId')

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
  storyKindRegex: /^(Application Menu|Button|Forms|Menu|Page|Pages)$/,
  test: renderOnly,
})
