import { ReactSelector, waitForReact } from 'testcafe-react-selectors'
import { Selector } from 'testcafe';

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

fixture `User can sign up only with a valid email address`
    .page(BASE_URL + '/signup')

    const user = {
        name: 'James Bond',
        password: 'test1234',
    }
    const form = ReactSelector('SignupForm')
    const emailTextFieldError = Selector('#email-text-field-error')

    test('Email address cannot be without the @symbol', async t => {
        await waitForReact()

        await t
        .typeText(form.find('input[name=name]'), user.name)
        .typeText(form.find('input[name=email]'), 'testAtgmail.com')
        .typeText(form.find('input[name=password]'), user.password)
        .click(form.find('button[type=submit]'))
        .expect(emailTextFieldError.innerText).eql('email must be a valid email')
    });
    
    test('Email address cannot miss a dot', async t => {
        await waitForReact()

        await t
        .typeText(form.find('input[name=name]'), user.name)
        .typeText(form.find('input[name=email]'), 'test@gmailcom')
        .typeText(form.find('input[name=password]'), user.password)
        .click(form.find('button[type=submit]'))
        .expect(emailTextFieldError.innerText).eql('email must be a valid email')
    });

    test('Email address cannot be a random string', async t => {
        await waitForReact()

        await t
        .typeText(form.find('input[name=name]'), user.name)
        .typeText(form.find('input[name=email]'), 'test@gmail')
        .typeText(form.find('input[name=password]'), user.password)
        .click(form.find('button[type=submit]'))
        .expect(emailTextFieldError.innerText).eql('email must be a valid email')
    });

    test('Email address field cannot be empty', async t => {
        await waitForReact()

        await t
        .typeText(form.find('input[name=name]'), user.name)
        .typeText(form.find('input[name=password]'), user.password)
        .click(form.find('button[type=submit]'))
        .click(form.find('input[name=name]'))
        .expect(emailTextFieldError.innerText).eql('email is a required field')
    });