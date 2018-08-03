import {
  loginAsNewUser,
  generateTitle,
  enterRichText,
  confirmRichText,
} from '../helpers'
import { Selector } from 'testcafe'

fixture('Editor sections')

test('Can add a new Section title', async t => {
  await loginAsNewUser(t)

  await t.click(Selector('#create-project'))

  const sectionTitleField = Selector(
    '.manuscript-editor h1:first-of-type'
  ).withAttribute('placeholder', 'Section title')

  const sectionTitle = generateTitle(6)

  // reduces test speed by 50 %. This overrides the global test speed setting.
  await t.setTestSpeed(0.5)
  await enterRichText(t, sectionTitleField, sectionTitle)

  await confirmRichText(t, sectionTitleField, sectionTitle)
})
