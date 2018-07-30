import { Selector } from 'testcafe'
import { generateUser, signup } from './helpers'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

fixture('User can sign up only with a valid email address').page(
  BASE_URL + '/signup'
)

const user = generateUser()

const form = Selector('#signup-form')
const passwordTextFieldError = Selector('#password-text-field-error')

test('Password field cannot be empty', async t => {
  await t
    .typeText(form.find('input[name=name]'), user.name)
    .typeText(form.find('input[name=email]'), user.email)
    .click(form.find('button[type=submit]'))
    .click(form.find('input[name=email]'))
    .expect(passwordTextFieldError.innerText)
    .eql('password is a required field')
})

test('Password must be at least 8 characters', async t => {
  await signup(t, {
    email: user.email,
    name: user.name,
    password: '1234',
  })

  await t
    .expect(passwordTextFieldError.innerText)
    .eql('password must be at least 8 characters')
})
