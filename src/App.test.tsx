import { shallow } from 'enzyme'
import * as React from 'react'
import App from './App'
import { Main, Page, Sidebar } from './components/Page'

test('displays a Page with appropriate components', () => {
  const wrapper = shallow(<App />)

  expect(wrapper.find(Page)).toHaveLength(1)
  expect(wrapper.find(Sidebar)).toHaveLength(1)
  expect(wrapper.find(Main)).toHaveLength(1)
})
