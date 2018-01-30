import { configure } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

process.env.API_BASE_URL = 'https://127.0.0.1/'
