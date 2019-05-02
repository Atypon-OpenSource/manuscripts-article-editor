import { generateUser, login, signup, generateParagraph, generateTitle, createProject} from './helpers'

describe('Projects', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })
    it('Project is persisted after logout', () => {

        const title = generateTitle(4)
        const paragraph = generateParagraph(6)
        const manuscriptTitle = generateTitle(3)
        const projectTitle = generateTitle(3)
       
        login(user, true)
        createProject()
        cy.wait(1000)
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type(' ' + title)
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' ' + paragraph + '+')
        cy.get('#manuscript-title-field .title-editor').type(manuscriptTitle)
        cy.get('#project-title-field .title-editor').type(projectTitle)
        cy.get('#menu-bar-icon', { timeout: 10000 }).click()
        cy.wait(5000)
        cy.get('#projects-sidebar').should('exist')
        cy.get('#projects-sidebar',{ timeout: 100000 }).contains(projectTitle)
        cy.get('#user-dropdown').find('.dropdown-toggle').click()
        cy.get('[href="/logout"]').click()
        cy.wait(2000)
        cy.get('input[name=email]').type(user.email)
        cy.get('input[name=password]').type(user.password)
        cy.get('button[type=submit]').click()
        cy.get('#projects-sidebar', { timeout: 100000 })
        cy.get('#projects-sidebar').contains(projectTitle)
        cy.get('#projects-sidebar').contains(projectTitle).click()
        cy.get('.manuscript-editor', { timeout: 100000 })
        cy.get('#project-title-field .title-editor').contains(projectTitle)
        cy.get('.manuscript-editor').contains(paragraph)
    })
})