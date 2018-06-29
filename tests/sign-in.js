import { ReactSelector } from 'testcafe-react-selectors'
import { login, signup } from './actions'

fixture('Login')

test('Should be able to login and create a new project', async t => {
  await signup(t)
  await login(t)

  const sidebar = ReactSelector('Sidebar')

  const sidebarTitle = sidebar.find('SidebarTitle')
  const sidebarTitleText = await sidebarTitle.textContent
  await t.expect(sidebarTitleText).eql('Projects')

  const sidebarIcon = sidebar.find('SidebarIcon')
  await t.click(sidebarIcon).wait(5000)
})
