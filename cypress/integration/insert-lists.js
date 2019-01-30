import { generateUser, login, signup, createProject } from './helpers'

describe('Lists', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can enter unordered lists', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.wait(500)
        cy.get('.manuscript-editor').type('apple pie')
        cy.get('[title="Wrap in bullet list"]').click()
        cy.get('ul').should('have.length', 1)
        cy.get('ul').should('any', 'apple pie')
        cy.get('ol').should('not.exist')
    })

    it('Can enter ordered lists', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.wait(500)
        cy.get('.manuscript-editor').type('banana split')
        cy.get('[title="Wrap in ordered list"]').click()
        cy.get('ol').should('have.length', 1)
        cy.get('ol').should('any','banana')
        cy.get('ul').should('not.exist')
    })
})