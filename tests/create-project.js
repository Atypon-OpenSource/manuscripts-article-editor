import { signup, login } from './actions'
import { Selector } from 'testcafe';

fixture `Projects`
    
    const sidebar = Selector('#sidebar');
    const projectTitle = Selector('#project-title-title-field');
    const component = Selector('#header-title-field');
    const headerTitle = component.find('div')
    
    test('Can create a new project', async t => {
      await signup(t)
      await login(t)
      
      await t
      .wait(500)
      .click(sidebar.find('#sidebar-add-button'))
      .expect(projectTitle.innerText).eql('Untitled Project\n')
    });

    test('Can name a manuscript title', async t => {
        await login(t)
        
        await t
        .wait(500)
        .click(sidebar.find('#sidebar-add-button'))
        .click(component)
        .typeText(component, 'Test title')
        .expect(headerTitle.innerText).eql('Test title')
    });
