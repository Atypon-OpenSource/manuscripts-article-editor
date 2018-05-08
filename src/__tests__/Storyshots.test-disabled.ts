jest.mock('../lib/token')
jest.mock('../lib/deviceId')

import initStoryshots from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
})
