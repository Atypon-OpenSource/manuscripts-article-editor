import { generateUser } from './helpers'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

describe('User can sign up only with a valid email address', () => {
    const user = generateUser()
    
    it('Email address cannot be without the @symbol', () => {

        const user = generateUser()
    
        cy.visit(BASE_URL + '/signup')
        cy.get('input[name=name]').type(user.name)
        cy.get('input[name=email]').type('testAtgmail.com')
        cy.get('input[name=password]').type(user.password)
        cy.get('button[type=submit]').click()
        cy.get('#email-text-field-error').contains('email must be a valid email')      
    })

    it('Email address cannot miss a dot', () => {

        const user = generateUser()
    
        cy.visit(BASE_URL + '/signup')
        cy.get('input[name=name]').type(user.name)
        cy.get('input[name=email]').type('test@gmailcom')
        cy.get('input[name=password]').type(user.password)
        cy.get('button[type=submit]').click()
        cy.get('#email-text-field-error').contains('email must be a valid email')      
    })

    it('Email address cannot be a random string', () => {

        const user = generateUser()
    
        cy.visit(BASE_URL + '/signup')
        cy.get('input[name=name]').type(user.name)
        cy.get('input[name=email]').type('test@gmail')
        cy.get('input[name=password]').type(user.password)
        cy.get('button[type=submit]').click()
        cy.get('#email-text-field-error').contains('email must be a valid email')      
    })

    it('Email address field cannot be empty', () => {

        const user = generateUser()
    
        cy.visit(BASE_URL + '/signup')
        cy.get('input[name=name]').type(user.name)
        cy.get('input[name=password]').type(user.password)
        cy.get('button[type=submit]').click()
        cy.get('#email-text-field-error').contains('email is a required field')      
    })
})