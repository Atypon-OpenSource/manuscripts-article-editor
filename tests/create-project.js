import { signup, login } from './actions'
import { ReactSelector } from 'testcafe-react-selectors';
import { Selector, ClientFunction } from 'testcafe';

fixture `Projects`

    const sidebar = Selector('#sidebar');
    const projectTitle = Selector('a');
    
    test('Can create a new project', async t => {
      await signup(t)
      await login(t)
      
      await t
      .click(sidebar.find('button'))
      .expect(projectTitle.innerText).eql('Untitled Project')
    })