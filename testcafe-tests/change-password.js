import { loginAsNewUser, login } from './helpers'
import { Selector, ClientFunction } from 'testcafe'

fixture('Change password')

const userDropdown = Selector('#user-dropdown')
const userDropdownToggle = userDropdown.find('.dropdown-toggle')
const changePasswordLink = userDropdown
  .find('a')
  .withAttribute('href', '/change-password')
const logoutLink = userDropdown.find('a').withAttribute('href', '/logout')
const changePasswordForm = Selector('#change-password-form')
const getLocation = ClientFunction(() => document.location.href)

test('Can change a password', async t => {
  const newPassword = 'M4nu5cr1pt00'

  const user = await loginAsNewUser(t)

  await t.click(userDropdownToggle)
  await t.click(changePasswordLink)

  await t
    .typeText(
      changePasswordForm.find('input[name=currentPassword]'),
      user.password
    )
    .typeText(changePasswordForm.find('input[name=newPassword]'), newPassword)
    .click(changePasswordForm.find('button[type=submit]'))

  await Selector('#create-project')()
  await t.expect(getLocation()).contains('/projects')

  await t.click(userDropdownToggle)
  await t.click(logoutLink)

  await Selector('#login-form')()
  await t.expect(getLocation()).contains('/login')

  await login(t, {
    ...user,
    password: newPassword,
  })

  await t.expect(Selector('#create-project')).ok()
})
