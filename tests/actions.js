import { ReactSelector, waitForReact } from 'testcafe-react-selectors'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

const user = {
  email: 'test@example.com',
  name: 'Example User',
  password: '12345678',
}

export const signup = async (t) => {
  await t.navigateTo(BASE_URL + '/signup')
  await waitForReact()

  const form = ReactSelector('SignupForm')

  await t
    .typeText(form.find('input[name=name]'), user.name)
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))
    .wait(5000)
}

export const login = async (t) => {
  await t.navigateTo(BASE_URL + '/login')
  await waitForReact()

  const form = ReactSelector('LoginForm')

  await t
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))
}
