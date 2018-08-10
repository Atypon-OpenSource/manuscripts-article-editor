import registerRequireContextHook from 'babel-plugin-require-context-hook/register'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'
import uuid from 'uuid'

registerRequireContextHook()

configure({ adapter: new Adapter() })

process.env.API_BASE_URL = 'https://127.0.0.1/'

const supportedCommands: string[] = []

Object.defineProperty(document, 'queryCommandSupported', {
  value: (cmd: string) => supportedCommands.includes(cmd),
})

Object.defineProperty(document, 'execCommand', {
  value: (cmd: string) => supportedCommands.includes(cmd),
})

// https://github.com/jsdom/jsdom/issues/317

Object.defineProperty(document, 'createRange', {
  value: () => ({
    createContextualFragment: JSDOM.fragment,
  }),
})

if (!window.URL.createObjectURL) {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(() => 'blob:https://localhost/' + uuid.v4()),
  })
}
