import {
    loginAsNewUser,
    normaliseLineReturn,
    generateParagraph,
    normaliseWhitespace
  } from './helpers'
  import { Selector } from 'testcafe'
  
  fixture('Editor sections')
  
  test('Can add a paragraph to a section contents', async t => {
    await loginAsNewUser(t)
  
    await t.click(Selector('#create-project'))

    const sectionContentField = Selector('.ProseMirror').find('p').withAttribute('data-placeholder', 'Section contents')
    const sectionParagraph = normaliseLineReturn(generateParagraph(4))
  
    await t
      .click(sectionContentField)
      .expect(sectionContentField.hasClass('ProseMirror-focused'))
    await t.typeText(sectionContentField, sectionParagraph, { speed: 0.5, paste: true })
  
    await t
      .expect(normaliseWhitespace(await sectionContentField.textContent))
      .eql(sectionParagraph)
  })
  