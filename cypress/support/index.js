// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import faker from 'faker'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'
const timestamp = () => Math.floor(Date.now() / 1000)

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const generateUser = () => ({
  email: timestamp() + '-' + faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
})

export const signup = (user, confirm) => {
  cy.visit(BASE_URL + '/signup')
  cy.get('input[name=name]').type(user.name)
  cy.get('input[name=email]').type(user.email)
  cy.get('input[name=password]').type(user.password)
  cy.get('button[type=submit]').click()

  if (confirm) {
    cy.contains('Thanks for signing up!')
  }
}

export const login = (user, confirm) => {
    cy.visit(BASE_URL + '/login')
    cy.get('input[name=email]').type(user.email)
    cy.get('input[name=password]').type(user.password)
    cy.get('button[type=submit]').click()

  if (confirm) {
    cy.url({timeout: 3000}).should('includes', '/projects')
    cy.get('#user-dropdown')
  }
}
   
export const loginAsNewUser = () => {
    const user = generateUser()
    signup(user, true)
    login(user, true)
  
    return user
}

describe('Registration and login', () => {
    it('Can register and login', () => {
        loginAsNewUser()
    })
})