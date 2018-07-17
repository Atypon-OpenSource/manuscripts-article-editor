import { loginAsNewUser } from './helpers'
import { Selector } from 'testcafe'

fixture('Successful login')

const sidebarTitle = Selector('#projects-sidebar .sidebar-title')

test('Should be able to login', async t => {
  await loginAsNewUser(t)

  await t.expect(sidebarTitle.textContent).eql('Projects')
})
