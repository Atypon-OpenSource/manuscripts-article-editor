import { signup, login } from './actions'
import { ReactSelector } from 'testcafe-react-selectors';
import { Selector, ClientFunction } from 'testcafe';

fixture `Successful login`

    const sidebar = Selector('#projects');
    const dropdDownToggle = Selector('#user-dropdown-toggle');
    const signUpForm = ReactSelector('SignupForm')
    const deleteAccount = Selector('#delete-account-link');
    const deleteAccountForm = ReactSelector('DeleteAccountForm');
    const getLocation = ClientFunction(() => document.location.href);

    test('Should be able to login', async t => {
      await signup(t)
      await login(t)
      
      await t
        .expect(sidebar.innerText).eql('Projects')
    })

   
    test('Should be able to delete an account', async t => {
      await login(t)
      
      await t
        .expect(sidebar.innerText).eql('Projects')
        .click(dropdDownToggle)
        .hover(deleteAccount)
        .click(deleteAccount)
        .typeText(deleteAccountForm.find('input[name=password]'), '12345678')
        .click(deleteAccountForm.find('button[type=submit]'))
        .wait(5000)
        .expect(getLocation()).contains('/signup')
        .expect(signUpForm.exists).ok();
    })
 