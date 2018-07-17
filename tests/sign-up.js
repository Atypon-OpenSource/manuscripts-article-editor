import { Selector } from 'testcafe'
import { generateUser, signup } from './helpers'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

fixture('User can sign up for an account').page(BASE_URL + '/signup')

const form = Selector('#signup-form')
const signInLink = form.find('a')
const nameTextFieldError = Selector('#name-text-field-error')
const signUpConfirmationMessage = Selector('#signup-confirm')
const signUpFormError = Selector('.form-error')

test('Sign up form components exists', async t => {
  await t
    .expect(form.find('input[name=name]'))
    .ok()
    .expect(form.find('input[name=email]'))
    .ok()
    .expect(form.find('input[name=password]'))
    .ok()
    .expect(form.find('button[type=submit]'))
    .ok()
    .expect(form.find('checkbox[name=allowsTracking]'))
    .ok()
    .expect(signInLink.innerText)
    .eql('SIGN IN')
})

test('Name field cannot be empty', async t => {
  const user = generateUser()

  await t
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))
    .click(form.find('input[name=password]'))
    .expect(nameTextFieldError.innerText)
    .eql('name is a required field')
})

test('Can only sign up once with the same email address', async t => {
  const user = generateUser()

  await signup(t, user, true)

  const message = signUpConfirmationMessage.with({ boundTestRun: t })

  await t.expect(message.innerText).match(/^An email has been sent to /)

  await signup(t, user)

  await t
    .expect(signUpFormError.innerText)
    .eql('The email address is already registered')
})
