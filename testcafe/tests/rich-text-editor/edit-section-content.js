import {
  loginAsNewUser,
  normaliseLineReturn,
  generateParagraph,
  enterRichText,
  confirmRichText,
} from '../helpers'
import { Selector } from 'testcafe'

fixture('Editor sections')

test('Can add a paragraph to a section contents', async t => {
  await loginAsNewUser(t)

  await t.click(Selector('#create-project'))

  const sectionContentField = Selector('.manuscript-editor p:first-of-type')

  const sectionParagraph = normaliseLineReturn(generateParagraph(4))

  await enterRichText(t, sectionContentField, sectionParagraph)

  await confirmRichText(t, sectionContentField, sectionParagraph)
})
