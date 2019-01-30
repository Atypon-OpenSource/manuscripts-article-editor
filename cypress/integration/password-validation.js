import { generateUser } from './helpers'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

describe('User can sign up only with a password', () => {
    const user = generateUser()
    
    it('Password field cannot be empty', () => {

        const user = generateUser()
    
        cy.visit(BASE_URL + '/signup')
        cy.get('input[name=name]').type(user.name)
        cy.get('input[name=email]').type(user.email)
        cy.get('button[type=submit]').click()
        cy.get('#password-text-field-error').contains('password is a required field')      
    })

    it('Password must be at least 8 characters', () => {

        const user = generateUser()
    
        cy.visit(BASE_URL + '/signup')
        cy.get('input[name=name]').type(user.name)
        cy.get('input[name=email]').type(user.email)
        cy.get('input[name=password]').type('12test')
        cy.get('button[type=submit]').click()
        cy.get('#password-text-field-error').contains('password must be at least 8 characters')      
    })
})