import { generateUser, login, signup } from './helpers.spec'

describe('Figures', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can insert and exit a figure caption with enter', () => {
        login(user, true)

        cy.get('#create-project').click()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert figure"]').click()
        cy.get('.figure-panel').should('exist')
        cy.get('[tabindex="2"]').type('{enter}')
        cy.get('p').last()
        cy.get('[tabindex="2"]').type('hi')
        cy.get('p').last().should('have.text', 'hi')
    })

    it('Can delete a figure panel', () => {
        login(user, true)

        cy.get('#create-project').click()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert figure"]').click()
        cy.get('.block-figure_element > .block-gutter > .edit-block > svg').click()
        cy.get(':nth-child(3) > .menu-item').click()
        cy.get('.figure-panel').should('not.exist')
    })

    
})