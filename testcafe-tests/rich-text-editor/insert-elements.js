import { loginAsNewUser, enterRichText } from '../helpers'
import { Selector } from 'testcafe'

fixture('Tables and Figures')

test('Can insert a table', async t => {
  await loginAsNewUser(t)

  const sectionContentField = Selector('.manuscript-editor p:first-of-type')
  const toolbar = Selector('.toolbar-group')
  const table = Selector('.block-container').find('figure').find('table')

  
  await t.click(Selector('#create-project'))
  await enterRichText(t, sectionContentField, 'hello')
  await t.click(Selector(toolbar).find('button').withAttribute('title', 'Insert table'))
  await t.expect(table).ok()
})

test('Can insert a figure', async t => {
    await loginAsNewUser(t)
  
    const sectionContentField = Selector('.manuscript-editor p:first-of-type')
    const toolbar = Selector('.toolbar-group')
    const figure = Selector('.figure-panel')
  
    
    await t.click(Selector('#create-project'))
    await enterRichText(t, sectionContentField, 'hello')
    await t.click(Selector(toolbar).find('button').withAttribute('title', 'Insert figure'))
    await t.expect(figure).ok()
  })

  test('Can insert an equation block', async t => {
    await loginAsNewUser(t)
  
    const sectionContentField = Selector('.manuscript-editor p:first-of-type')
    const toolbar = Selector('.toolbar-group')
    const equationBlock = Selector('.block-container').find('prosemirror-equation')
  
    
    await t.click(Selector('#create-project'))
    await enterRichText(t, sectionContentField, 'hello')
    await t.click(Selector(toolbar).find('button').withAttribute('title', 'Insert equation block'))
    await t.expect(equationBlock).ok()
  })