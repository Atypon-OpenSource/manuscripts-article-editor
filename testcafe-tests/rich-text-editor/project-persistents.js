import {
  generateTitle,
  confirmRichText,
  enterRichText,
  login,
  generateUser,
  signup,
  logout,
} from '../helpers'
import { Selector } from 'testcafe'
import faker from 'faker'

fixture('Project persistent')

test.skip('Project is persisted after logout', async t => {
  const user = generateUser()
  await signup(t, user, true)
  await login(t, user, true)

  await t.click(Selector('#create-project'))

  const manuscriptTitleField = Selector('#manuscript-title-field .title-editor')
  const projectTitleField = Selector('#project-title-field .title-editor')

  await t.expect(manuscriptTitleField.textContent).eql('')
  await t.expect(projectTitleField.textContent).eql('')

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

  await t.click(Selector('#menu-bar-icon'))
  await logout(t)
  await login(t, user, true)

  await t.click(
    Selector('#projects-sidebar')
      .find('a')
      .find('div')
      .withAttribute('contenteditable', 'false')
      .withText(projectTitle)
  )

  await t.expect(manuscriptTitleField.textContent).eql(manuscriptTitle)
  await t.expect(projectTitleField.textContent).eql(projectTitle)
})
