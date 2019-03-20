import { generateUser, login, signup, generateTitle, createProject, generateParagraph, insertParagraph } from './helpers'
import faker from 'faker'

describe('Undo', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })
    it('Can undo the insertion of the the project title', () => {

        const manuscriptTitle = generateTitle(
            faker.random.number({
              max: 3,
              min: 2,
        }))

        login(user, true)

        createProject()
        cy.get('#manuscript-title-field .title-editor').type(manuscriptTitle)
        cy.get('#manuscript-title-field .title-editor').contains(manuscriptTitle)
        cy.get('body').type('{cmd}z')
        cy.get('#manuscript-title-field .title-editor').should('have.value', '')
    })
    it('Can undo insertion of a paragraph',() => {

        const paragraph = generateParagraph(3)

        login(user, true)
        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' ' + paragraph)
        cy.get('p').contains(paragraph)
        cy.get('body').type('{cmd}z')
        cy.get('p').should('have.value', '')
        cy.get('p').should('not.have.value', paragraph)
    })
    it('Can undo insertion of a manuscript title',() => {

        const title = generateTitle(6)

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type(' ' + title)
        cy.get('h1').contains(title) 
        cy.get('body').type('{cmd}z')
        cy.get('h1').should('have.value', '') 
        cy.get('h1').should('not.have.value', title) 
    })
    it('Can undo insertion of an equation',() => {

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('[title="Insert equation"]').click()
        cy.get('.block-equation_element').should('exist')
        cy.get('.manuscript-editor').type('{cmd}z')
        cy.get('.equation > div').should('not.exist')
    })
    it('Can undo text decoration',() => {

        const paragraph = 'hello world'

        login(user, true)
        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type('{cmd}b')
        cy.get('.manuscript-editor').type(' ' + paragraph)
        cy.get('b').contains(paragraph) 
        cy.get('b').type('{cmd}z')
        cy.get('b').should('not.exist')
        cy.get('p').should('have.value', '')
        cy.get('p').should('not.have.value', paragraph)
    })
})