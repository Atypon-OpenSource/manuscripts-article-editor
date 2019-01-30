import { generateUser, login, signup, generateParagraph, generateTitle, createProject } from './helpers'

describe('Projects', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })
    it.skip('Project is persisted after logout', () => {

        const title = generateTitle(6)
        const paragraph = generateParagraph(10)

        login(user, true)
        createProject()
        cy.wait(1000)
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type(' ' + title)
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' ' + paragraph + '+')
        cy.get('#menu-bar-icon').click()
        cy.get('#user-dropdown').find('.dropdown-toggle').click()
        cy.wait(200)
        cy.get('[href="/logout"]').click()
        cy.wait(1000)
    })
})