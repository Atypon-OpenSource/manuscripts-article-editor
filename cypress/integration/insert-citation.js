import { generateUser, login, signup, createProject } from './helpers.spec'

describe('Citations', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can open the Citation editor', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor').should('exist')
    })

    it('Can search and insert a citation from external sources', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('.citation-editor > :nth-child(1)').should('exist')
        cy.get('.citation-editor > :nth-child(4)').should('not.exist')
        cy.get('[data-cy="plus-icon"]').first().click()
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('sup').contains('1')
    })

    it('Can insert multiple citations from external sources', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Leopold Parts')
        cy.get('.citation-editor > :nth-child(1)').should('exist')
        cy.get('[data-cy="plus-icon"]').should('have.length', 3)
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('sup').contains("1–3")
    })

    it('Can view inserted citations', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Higgs Boson particle')
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
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
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
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
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('Matias Piipari')
        cy.get('[data-cy="plus-icon"]').first().click()
        cy.get('button').contains('Cite').click({force: true})
        cy.get('[title="Insert citation"]').click()
        cy.get('.citation-editor').contains('Library')
        cy.get('[data-cy="search-result-author"]').contains('Piipari')
    })

    it('Can show more references from external sources', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert citation"]').click()
        cy.get('[type="Search"]').type('cancer genomics')
        cy.get('[data-cy="plus-icon"]').should('exist')
        cy.get('[data-cy="more-button"]').click()
        cy.get('[data-cy="plus-icon"]').should('exist')
        cy.get('[data-cy="plus-icon"]').should('have.length', 25)
        cy.get('[data-cy="plus-icon"]').each(($el) => {
            cy.wrap($el).click()
        })
        cy.get('button').contains('Cite').click({force: true})
        cy.get('h1').contains('Bibliography')
        cy.get('sup').contains("1–25")
    })

})