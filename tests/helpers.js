import { ReactSelector, waitForReact } from 'testcafe-react-selectors'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

export const signupHelper = async (t, name, email, password  ) => {
  await t.navigateTo(BASE_URL + '/signup')
  await waitForReact()

  const form = ReactSelector('SignupForm')

  await t
    .typeText(form.find('input[name=name]'), name)
    .typeText(form.find('input[name=email]'), email)
    .typeText(form.find('input[name=password]'), password)
    .click(form.find('button[type=submit]'))
}