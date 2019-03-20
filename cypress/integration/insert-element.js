import { generateUser, login, signup, createProject } from './helpers'

describe('Figures', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can insert a table', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert table"]').click()
        cy.get('table').should('exist')
    })

    it('Can insert an equation', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert equation"]').click()
        cy.get('.block-equation_element').should('exist')
        cy.get('.equation > div').contains('Equation')
    })

    it('Can insert a figure', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert figure"]').click()
        cy.get('figure').should('exist')
        //cy.get('.figure-panel > div').contains('Click or drop an image here')
    })
})