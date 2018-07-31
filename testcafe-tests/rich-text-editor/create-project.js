import {
  confirmRichText,
  enterRichText,
  generateTitle,
  loginAsNewUser,
} from '../helpers'
import { Selector } from 'testcafe'
import faker from 'faker'

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

  await t.click(Selector('#create-project'))

  const manuscriptTitleField = Selector('#manuscript-title-field .title-editor')
  const projectTitleField = Selector('#project-title-field .title-editor')

  await t.expect(manuscriptTitleField.textContent).eql('')
  await t.expect(projectTitleField.textContent).eql('Untitled Project')

  const manuscriptTitle = generateTitle(
    faker.random.number({
      max: 10,
      min: 3,
    })
  )

  const projectTitle = generateTitle(
    faker.random.number({
      max: 3,
      min: 2,
    })
  )

  await enterRichText(t, manuscriptTitleField, manuscriptTitle)
  await enterRichText(t, projectTitleField, projectTitle)

  await confirmRichText(t, manuscriptTitleField, manuscriptTitle)
  await confirmRichText(t, projectTitleField, projectTitle)
})
