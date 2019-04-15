import { generateUser, login, signup, createProject } from './helpers'

describe('Figures', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })
    
    it('Can delete a figure panel', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert figure"]').click()
        cy.get('figure').should('exist')
        cy.get('.block-figure_element > .block-gutter > .edit-block').click()
        cy.get(':nth-child(3) > .menu-item').click()
        cy.get('.figure-panel').should('not.exist')
    })
})