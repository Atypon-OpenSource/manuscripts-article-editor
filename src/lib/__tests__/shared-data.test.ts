import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as HttpStatusCodes from 'http-status-codes'
import config from '../../config'
import { fetchSharedData } from '../shared-data'

describe('fetchSharedData', () => {
  it('returns data from shared', async () => {
    const mock = new MockAdapter(axios)
    const filename = 'foo'
    const mockFile = {
      name: 'foo bar',
    }

    mock
      .onGet(config.data.url + '/shared/' + filename)
      .reply(HttpStatusCodes.OK, mockFile)

    const response = await fetchSharedData(filename)

    expect(response).toEqual(mockFile)
  })
})
