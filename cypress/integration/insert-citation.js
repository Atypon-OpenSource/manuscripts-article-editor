import { generateUser, login, signup, createProject } from './helpers'

describe('Citations', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can search and insert a citation from external sources', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor', {timeout: 10000}).should('exist')
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('[data-cy="plus-icon"]', {timeout: 10000}).should('exist')
        cy.get('.citation-editor > :nth-child(1)').should('exist')
        cy.get('.citation-editor > :nth-child(4)').should('not.exist')
        cy.get('[data-cy="plus-icon"]').first().click()
        cy.get('[data-cy="plus-icon-ok"]', {timeout: 10000}).should('exist')
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('.csl-entry').should('exist')
        cy.get('.csl-left-margin').contains('1.')
    })

    it('Can insert multiple citations from external sources', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor', {timeout: 10000}).should('exist')
        cy.get('[type="Search"]').type('Leopold Parts')
        cy.get('[data-cy="plus-icon"]', {timeout: 10000}).should('exist')
        cy.get('.citation-editor > :nth-child(1)').should('exist')
        cy.get('[data-cy="plus-icon"]').should('have.length', 3)
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
        cy.get('[data-cy="plus-icon-ok"]', {timeout: 10000}).should('have.length', 3)
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('.csl-entry').should('exist')
        cy.get('sup').contains("1–3")
    })

    it('Can view inserted citations', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor', {timeout: 15000}).should('exist')
        cy.get('[type="Search"]').type('Higgs Boson particle')
        cy.get('[data-cy="plus-icon"]', {timeout: 10000}).should('exist')
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
        cy.get('[data-cy="plus-icon-ok"]', {timeout: 10000}).should('have.length', 3)
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('sup').should('be.visible').invoke('width').should('be.greaterThan', 0)
        cy.wait(100)
        cy.get('sup').click()
        cy.get('.citation-editor').should('exist')
    })

    it('Inserted references are shown in the Bibliogprahy', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor', {timeout: 10000}).should('exist')
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('[data-cy="plus-icon"]', {timeout: 10000}).should('exist')
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
        cy.get('[data-cy="plus-icon-ok"]', {timeout: 10000}).should('have.length', 3)
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('.csl-bib-body').each(($el) => {
            cy.wrap($el).contains('Piipari')
            cy.wrap($el).get('.csl-entry').should('have.length', 3)
        })
    })

    it('Cited references are available in the users library', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor', {timeout: 10000}).should('exist')
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('[data-cy="plus-icon"]', {timeout: 10000}).should('exist')
        cy.get('[data-cy="plus-icon"]').first().click()
        cy.get('[data-cy="plus-icon-ok"]', {timeout: 15000}).should('exist')
        cy.get('button').contains('Cite').click({force: true})
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[data-cy="search-result-author"]').should('exist')
        cy.get('[data-cy="search-result-author"]').contains('Piipari')
    })

    it('Can show more references from external sources', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor', {timeout: 10000}).should('exist')
        cy.get('[type="Search"]').type('diabetes')
        cy.get('[data-cy="plus-icon"]', {timeout: 20000}).should('exist')
        cy.get('[data-cy="more-button"]').click()
        cy.get('[data-cy="plus-icon"]', {timeout: 20000}).should('exist')
        cy.get('[data-cy="plus-icon"]').its('length').should('be.gt', 20)
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
        cy.get('[data-cy="plus-icon-ok"]', {timeout: 20000}).its('length').should('be.gt', 10)
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('sup').contains("1–2")
    })

})