import { loginAsNewUser, enterRichText, confirmRichText } from '../helpers'
import { Selector } from 'testcafe'

fixture('Table figures')

test('Can insert a table caption', async t => {
  await loginAsNewUser(t)

  const sectionTitleField = Selector('.manuscript-editor h1:first-of-type')
  const toolbar = Selector('.toolbar-group')
  const tableCaption = Selector('.block-container').find('figcaption')
  
  await t.click(Selector('#create-project'))
  await t.click(sectionTitleField)
  await t.pressKey('enter')
  await t.click(Selector(toolbar).find('button').withAttribute('title', 'Insert table'))
  await t.typeText(tableCaption, 'Hello world', { paste: true, speed: 0.5 })
  await t.expect(tableCaption.innerText).eql('Table 1:Hello world')
})

test('Can exit a table caption with enter', async t => {
  await loginAsNewUser(t)

  const sectionTitleField = Selector('.manuscript-editor h1:first-of-type')
  const toolbar = Selector('.toolbar-group')
  const tableCaption = Selector('.block-container').find('figcaption')
  const sectionAfterTable = Selector('.block-container').find('p').nth(1)

  await t.click(Selector('#create-project'))
  await t.click(sectionTitleField)
  await t.pressKey('enter')
  await t.click(Selector(toolbar).find('button').withAttribute('title', 'Insert table'))
  await t.typeText(tableCaption, 'Hello world', { paste: true, speed: 0.5 })
  await t.pressKey('enter')
  await t.pressKey('h')
  await t.expect(tableCaption.innerText).notEql('Table 1:Hello worldh')
  await t.expect(sectionAfterTable.textContent).eql('h')
})