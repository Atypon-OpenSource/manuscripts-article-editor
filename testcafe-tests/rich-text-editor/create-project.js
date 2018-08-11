import { loginAsNewUser, createProjectWithTitle } from '../helpers'
import { Selector } from 'testcafe'

fixture('Projects')

test('Can create a new project', async t => {
  await loginAsNewUser(t)

  await t.click(Selector('#create-project'))

  const manuscriptTitleField = Selector('#manuscript-title-field .title-editor')
  const projectTitleField = Selector('#project-title-field .title-editor')

  await t.expect(manuscriptTitleField.textContent).eql('')
  await t.expect(projectTitleField.textContent).eql('Untitled Project')
})

test('Can create a new project and edit titles', async t => {
  await loginAsNewUser(t)
  await createProjectWithTitle(t)
})
