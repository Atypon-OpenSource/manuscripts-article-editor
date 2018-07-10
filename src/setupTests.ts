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

// tslint:disable-next-line:no-any
const storage: { [key: string]: any } = {}
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => storage[key],
    // tslint:disable-next-line:no-any
    setItem: (key: string, value: any) => {
      storage[key] = value
    },
    removeItem: (key: string) => delete storage[key],
  },
})

if (!window.URL.createObjectURL) {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(() => 'blob:null/' + uuid.v4()),
  })
}
