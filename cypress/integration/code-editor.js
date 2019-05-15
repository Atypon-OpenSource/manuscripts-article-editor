import { generateUser, login, signup, createProject } from './helpers'

describe('Code editor', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can insert a code editor', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' hello')
        cy.get('[title="Insert listing"]').click()
        cy.get('.CodeMirror', {timeout: 10000})
    })

    it('Can type in the code editor', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' hello')
        cy.get('[title="Insert listing"]').click()
        cy.get('.CodeMirror', {timeout: 10000})
        cy.get('.CodeMirror textarea').type('hello world', {force: true})
        cy.get('.CodeMirror-code').contains('hello world')
    })

    it('Can select a language from dropdown menu', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' hello')
        cy.get('[title="Insert listing"]').click()
        cy.get('.CodeMirror', {timeout: 10000})
        cy.get('select').select('javascript')
        cy.get('select').contains('JavaScript')
    })

    it('Shows code highlight', () => {
        login(user, true)

        createProject()
        cy.get('.manuscript-editor').type(' ')
        cy.get('.manuscript-editor').type('{enter}')
        cy.get('.manuscript-editor').type(' hello')
        cy.get('[title="Insert listing"]').click()
        cy.get('.CodeMirror', {timeout: 10000})
        cy.get('.CodeMirror textarea').type('let test = "hello";', {force: true})
        cy.get('select').select('javascript')
        cy.get('select').contains('JavaScript')
        cy.get('.cm-keyword').contains('let')
        cy.get('.cm-def').contains('test')
        cy.get('.cm-operator').contains('=')
        cy.get('.cm-string').contains('hello')
    })
})
