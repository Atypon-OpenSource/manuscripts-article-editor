import faker from 'faker'
import { Selector } from 'testcafe'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

const timestamp = () => Math.floor(Date.now() / 1000)

export const generateUser = () => ({
  email: timestamp() + '-' + faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
})

export const signup = async (t, user, confirm) => {
  await t.navigateTo(BASE_URL + '/signup')

  const form = Selector('#signup-form')

  await t
    .typeText(form.find('input[name=name]'), user.name)
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))

  if (confirm) {
    await Selector('#signup-confirm')()
  }
}

export const login = async (t, user, confirm) => {
  await t.navigateTo(BASE_URL + '/login')

  const form = Selector('#login-form')

  await t
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))

  if (confirm) {
    await Selector('#user-dropdown')()
  }
}

export const loginAsNewUser = async t => {
  const user = generateUser()
  await signup(t, user, true)
  await login(t, user, true)

  return user
}
