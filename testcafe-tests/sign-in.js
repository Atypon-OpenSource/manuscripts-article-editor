import { loginAsNewUser } from './helpers'
import { Selector } from 'testcafe'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

fixture('Successful login').page(BASE_URL + '/login')

const sidebarTitle = Selector('#projects-sidebar .sidebar-title')

test('Should be able to login', async t => {
  await loginAsNewUser(t)

  await t.expect(sidebarTitle.textContent).eql('Projects')
})
