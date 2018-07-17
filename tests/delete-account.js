import { loginAsNewUser } from './helpers'
import { Selector, ClientFunction } from 'testcafe'

fixture('Successful login')

const userDropdown = Selector('#user-dropdown')
const userDropdownToggle = userDropdown.find('.dropdown-toggle')
// const deleteAccountLink = userDropdown.find('a').withText('Delete account')
const deleteAccountLink = userDropdown.find('a').withAttribute('href', '/delete-account')
const signUpForm = Selector('#signup-form')
const deleteAccountForm = Selector('#delete-account-form')
const getLocation = ClientFunction(() => document.location.href)

test('Should be able to delete an account', async t => {
  const user = await loginAsNewUser(t)

  await t.click(userDropdownToggle)

  await t.click(deleteAccountLink)

  await t
    .typeText(deleteAccountForm.find('input[name=password]'), user.password)
    .click(deleteAccountForm.find('button[type=submit]'))

  await signUpForm()

  await t.expect(getLocation()).contains('/signup')
})
