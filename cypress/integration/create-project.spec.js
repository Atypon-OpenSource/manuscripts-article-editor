import { generateUser, login, signup, createProjectWithTitle } from './helpers.spec'

describe('Projects', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })
    it('Can create a new project', () => {
        login(user, true)
        cy.get('#create-project').click()
        cy.get('#manuscript-title-field .title-editor', { timeout: 10000 })
        cy.get('#project-title-field .title-editor', { timeout: 10000 })
    })
    it('Can create a new project and edit titles',() => {
        login(user, true)
        createProjectWithTitle()
    })
})