import { signupHelper, loginHelper } from './helpers'
import { ReactSelector } from 'testcafe-react-selectors';
import { Selector, ClientFunction } from 'testcafe';

fixture `Change password`

    const sidebar = Selector('#projects');
    const dropdDownToggle = Selector('#user-dropdown-toggle');
    const changePasswordMenu = Selector('#change-password-link');
    const signOutMenu = Selector('#logout-link');
    const changePasswordForm = ReactSelector('ChangePasswordForm');
    const getLocation = ClientFunction(() => document.location.href);

    test('Can change a password', async t => {
      await signupHelper(t, 'Travis Tester', 'travis_tester@example.com', '12345678')
      await loginHelper(t, 'travis_tester@example.com', '12345678')
      
      await t
        .click(dropdDownToggle)
        .hover(changePasswordMenu)
        .click(changePasswordMenu)
        .typeText(changePasswordForm.find('input[name=currentPassword]'), '12345678')
        .typeText(changePasswordForm.find('input[name=newPassword]'), 'M4nu5cr1pt00')
        .click(changePasswordForm.find('button[type=submit]'))
        .wait(5000)
        .expect(getLocation()).contains('/projects')
        .click(dropdDownToggle)
        .hover(signOutMenu)
        .click(signOutMenu)
        .wait(5000)
        .expect(getLocation()).contains('/login')
    });

   
    test('Can sign in with a new password', async t => {
        await loginHelper(t, 'travis_tester@example.com', 'M4nu5cr1pt00')
      
        await t
          .expect(sidebar.innerText).eql('Projects')
    });
 