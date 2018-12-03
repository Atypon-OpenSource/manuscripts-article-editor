import { generateUser, login, signup, generateParagraph } from './helpers.spec'

describe('Citations', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can open the Citation editor', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor').should('exist')
    })

    it('Can search citations from external sources', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('.citation-editor > :nth-child(1)').should('exist')
        cy.get('.citation-editor > :nth-child(4)').should('not.exist')
    })

    it('Can insert a citation from external sources', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('.citation-editor > :nth-child(1)').should('exist')
        cy.get('[data-cy="plus-icon"]').first().click()
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('sup').contains('1')
    })
})