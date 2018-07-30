import {
  loginAsNewUser,
  generateTitle,
  enterRichText,
  confirmRichText,
} from './helpers'
import { Selector } from 'testcafe'

fixture.skip('Editor sections')

test('Can add a new Section title', async t => {
  await loginAsNewUser(t)

  await t.click(Selector('#create-project'))

  const sectionTitleField = Selector(
    '.manuscript-editor h1:first-of-type'
  ).withAttribute('placeholder', 'Section title')

  const sectionTitle = generateTitle(6)

  await enterRichText(t, sectionTitleField, sectionTitle)

  await confirmRichText(t, sectionTitleField, sectionTitle)
})
