import { generateUser, login, signup } from './helpers'

describe('Template picker', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can create a research article project from a template', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.wait(1000)
        cy.get('[data-cy="arrow-down"]').click()
        cy.get('[data-cy="template-topics-list"]').contains('Biology').click()
        cy.contains('Biology Open').click()
        cy.get('[data-cy="create-button"]').first().click()
        cy.get('#manuscript-title-field .title-editor', { timeout: 10000 }).contains('Untitled Biology')
        cy.get('#project-title-field .title-editor', { timeout: 10000 })
    })

    it('Can create a document with correct section titles from a template', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.wait(1000)
        cy.get('[data-cy="arrow-down"]').click()
        cy.get('[data-cy="template-topics-list"]').contains('Biology').click()
        cy.get('[data-cy="article-type"]').contains('Research Article').click()
        cy.get('[data-cy="create-button"]').eq(1).click()
        cy.get('#manuscript-title-field .title-editor', { timeout: 10000 }).contains('Untitled Biology Open Research Article')
        cy.get('h1').contains('Abstract')
        cy.get('h1').contains('Keywords')
        cy.get('h1').contains('Introduction')
        cy.get('h1').contains('Materials and Methods')
        cy.get('h1').contains('Results')
        cy.get('h1').contains('Discussion')
        cy.get('h1').contains('Acknowledgments')
    })

    it('Can create a document with a placeholder from a template', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.wait(1000)
        cy.get('[data-cy="arrow-down"]').click()
        cy.get('[data-cy="template-topics-list"]').contains('Biology').click()
        cy.get('[data-cy="article-type"]').contains('Research Article').click()
        cy.get('[data-cy="create-button"]').eq(1).click()
        cy.get('#manuscript-title-field .title-editor', { timeout: 10000 }).contains('Untitled Biology Open Research Article')
        cy.get('p').contains('List of keywords relevant to the manuscript.')
    })

    it('Can search for a correct template', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.wait(1000)
        cy.get('[data-cy="arrow-down"]').click()
        cy.get('[data-cy="template-topics-list"]').contains('Medicine').click()
        cy.get('input[type="search"]').type('F1000')
        cy.get('[data-cy="article-type"]').contains('Research Article').click()
        cy.get('[data-cy="create-button"]').eq(1).click()
        cy.get('#manuscript-title-field .title-editor', { timeout: 10000 }).contains('Untitled F1000Research Research Article')
    })

    it('Can create an empty manuscript from within the template picker', () => {

        login(user, true)

        cy.get('#create-project').click()
        cy.wait(2000)
        cy.get('button').contains('Create empty manuscript').click()
        cy.get('#manuscript-title-field .title-editor', { timeout: 10000 })
        cy.get('h1[data-placeholder="Section heading"]')
    })
})