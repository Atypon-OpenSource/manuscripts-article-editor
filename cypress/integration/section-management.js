import { generateUser, login, signup, generateParagraph, createProject } from './helpers'

describe('Text decoration', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can enter bold text', () => {

        const paragraph = generateParagraph(6)

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Toggle bold"]').click()
        cy.get('.manuscript-editor').type(' ' + paragraph)
        cy.get('p').contains(paragraph) 
        //this test is using any as Cypress randomly leaves out the first character when typing
    })

    it('Can enter italic text', () => {

        const paragraph = generateParagraph(6)

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Toggle italic"]').click()
        cy.get('.manuscript-editor').type(' ' + paragraph)
        cy.get('p').contains(paragraph) 
    })

    it('Can enter underlined text', () => {

        const paragraph = generateParagraph(6)

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Toggle underline"]').click()
        cy.get('.manuscript-editor').type(' ' + paragraph)
        cy.get('p').contains(paragraph) 
    })

    it('Can enter subscript text', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type('drink some H')
        cy.get('[title="Toggle subscript"]').click()
        cy.get('.manuscript-editor').type('2')
        cy.get('[title="Toggle subscript"]').click()
        cy.get('.manuscript-editor').type('O')
        cy.get('p').should('any', 'drink some H')
        cy.get('sub').should('contain', '2')
        cy.get('sub').should('not.contain', 'O')
    })

    it('Can enter superscript text', () => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type('calcium, Ca')
        cy.get('[title="Toggle superscript"]').click()
        cy.get('.manuscript-editor').type('2+')
        cy.get('[title="Toggle superscript"]').click()
        cy.get('.manuscript-editor').type('is vital for your health')
        cy.get('p').should('contain', 'is vital for your health')
        cy.get('sup').should('contain', '2+')
        cy.get('sup').should('not.contain', 'a')
    })


})