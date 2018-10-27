import { generateUser, login, signup } from './helpers.spec'

describe('Equations', () => {
    const user = generateUser()

    it('Can insert an equation block caption', () => {
        signup(user, true)
        login(user, true)

        cy.get('#create-project').click()
        cy.get('.manuscript-editor', { timeout: 10000 }).type('{enter}')
        cy.get(':nth-child(5) > :nth-child(1) > .toolbar-item-button').should('have.attr', 'title', 'Insert figure').click()
        cy.get(':nth-child(2) > .empty-node > .figure-label').type('hello')
        //cy.get('.block-container').find(':nth-child(2) > .empty-node').type('Hello world')
        cy.get('.manuscript-editor').find('h1').first().click({force: true})
        cy.get('.edit-block').children(2).hover()
        cy.get('.edit-block').children(2).click({force: true})
        cy.get('.menu-section').children(1).hover()
        cy.get('.menu').click({force: true})
        cy.get('.block-container').then('figcaption').type('Hello world')
        cy.get('.block-container').then('figcaption').should('include', 'Equation 1:Hello world')
    })

/*test.skip('Can exit an equation block caption with enter', async t => {
  await loginAsNewUser(t)

  const sectionTitleField = Selector('.manuscript-editor h1:first-of-type')
  const toolbar = Selector('.toolbar-group')
  const equationCaption = Selector('.block-container').find('figcaption')
  const sectionAfterEquation = Selector('.block-container').find('p').nth(1)

  await t.click(Selector('#create-project'))
  await t.click(sectionTitleField)
  await t.pressKey('enter')
  await t.click(Selector(toolbar).find('button').withAttribute('title', 'Insert equation'))
  await t.typeText(equationCaption, 'Hello world', { paste: true, speed: 0.5 })
  await t.pressKey('enter')
  await t.pressKey('h')
  await t.expect(equationCaption.innerText).notEql('Table 1:Hello worldh')
  await t.expect(sectionAfterEquation.textContent).eql('h')
})*/

})