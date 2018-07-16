import { signupHelper } from './helpers'
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { Selector } from 'testcafe';

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

fixture `User can sign up for an account`
    .page(BASE_URL + '/signup')

    const user = {
        email: 'test@example.com',
        name: 'Example User',
        password: '12345678',
    }

const form = ReactSelector('SignupForm')
const signInLink = form.find('a')
const nameTextFieldError = Selector('#name-text-field-error')
const signUpConfirmationMessage = Selector('p')
const signUpFormError = Selector('.form-error')

test('Sign up form components exists', async t => {

  await t
    .expect(form.find('input[name=name]')).ok()
    .expect(form.find('input[name=email]')).ok()
    .expect(form.find('input[name=password]')).ok()
    .expect(form.find('button[type=submit]')).ok()
    .expect(form.find('checkbox[name=allowsTracking]')).ok()
    .expect(signInLink.innerText).eql('SIGN IN')
  });


test('Name field cannot be empty', async t => {
    await waitForReact()
    
    await t
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))
    .click(form.find('input[name=password]'))
    .expect(nameTextFieldError.innerText).eql('name is a required field')
  });
 
  test('Can sign up', async t => {
    await signupHelper(t, user.name, user.email, user.password)
    const message = signUpConfirmationMessage.with({ boundTestRun: t })
    
    await t
    .expect(message.innerText).eql('An email has been sent to test@example.com.')
  });


  test('Cannot sign up again with an email address that has already registered', async t => {
    await signupHelper(t, user.name, user.email, user.password)
    
    await t
    .expect(signUpFormError.innerText).eql('The email address is already registered')
  });