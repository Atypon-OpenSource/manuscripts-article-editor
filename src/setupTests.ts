import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

process.env.API_BASE_URL = 'https://127.0.0.1/'

const supportedCommands: string[] = []

Object.defineProperty(document, 'queryCommandSupported', {
  value: (cmd: string) => supportedCommands.includes(cmd),
})

Object.defineProperty(document, 'execCommand', {
  value: (cmd: string) => supportedCommands.includes(cmd),
})
