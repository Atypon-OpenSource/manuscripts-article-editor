import {
  loginAsNewUser,
  normaliseWhitespace,
  generateTitle,
} from '.../helpers'
import { Selector } from 'testcafe'

fixture('Editor sections')

test('Can add a new Section title', async t => {
  await loginAsNewUser(t)

  await t.click(Selector('#create-project'))

  const manuscriptTitleField = Selector('#manuscript-title-field')
  const sectionTitleField = Selector('.ProseMirror').find('h1')
  const sectionTitle = generateTitle(6)

  await t.expect(manuscriptTitleField.textContent).eql('')

  await t
    .click(sectionTitleField)
    .expect(sectionTitleField.hasClass('ProseMirror-focused'))
  await t.typeText(sectionTitleField, sectionTitle, { speed: 0.5, paste: true })

  await t
    .expect(normaliseWhitespace(await sectionTitleField.textContent))
    .eql(sectionTitle)
})
