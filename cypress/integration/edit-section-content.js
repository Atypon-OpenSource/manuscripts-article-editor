import { generateUser, login, signup, generateParagraph, generateTitle, createProject } from './helpers'

describe('Editor sections', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can add a paragraph to a section contents', () => {

        const paragraph = generateParagraph(20)

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' ' + paragraph)
        cy.get('p').contains(paragraph) 
        //Cypress has a bug where the first typed character is left out. Therefore I'm adding a space at the beginning of the paragraph.
    })

    it('Can add a new Section title', () => {

        const title = generateTitle(6)

        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type(' ' + title)
        cy.get('h1').contains(title) 
    })
})