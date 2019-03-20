
import faker from 'faker'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'
const timestamp = () => Math.floor(Date.now() / 1000)

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const generateName = () => {
  return (faker.name.firstName() + ' ' + faker.name.lastName())
}

export const generateUser = () => ({
  email: timestamp() + '-' + faker.internet.email(),
  name: generateName(),
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
    cy.url({timeout: 10000}).should('include', '/projects')
    cy.get('#user-dropdown').should('be.visible')
  }
}

export const logout = () => {
  cy.get('#user-dropdown').find('.dropdown-toggle').find('a')
  .withAttribute('href', '/signout').click()
  cy.get('input[name=email]').type(user.email)
  cy.get('input[name=password]').type(user.password)
  cy.get('button[type=submit]').click()

if (confirm) {
  cy.url({timeout: 10000}).should('includes', '/projects')
  cy.get('#user-dropdown')
}
}
   
export const loginAsNewUser = () => {
    const user = generateUser()
    signup(user, true)
    login(user, true)
  
    return user
}

export const generateTitle = wordCount => {
    const sentence = faker.lorem.words(wordCount)
  
    return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}
export const createProjectWithTitle = () => {
  
    const manuscriptTitle = generateTitle(
      faker.random.number({
        max: 10,
        min: 3,
      })
    )
  
    const projectTitle = generateTitle(
      faker.random.number({
        max: 3,
        min: 2,
      })
    )
    createProject()
    cy.get('#manuscript-title-field .title-editor').type(manuscriptTitle)
    cy.get('#project-title-field .title-editor').type(projectTitle)
    cy.get('#manuscript-title-field .title-editor').contains(manuscriptTitle)
    cy.get('#project-title-field .title-editor').contains(projectTitle)
}

export const generateParagraph = (wordCount) => {
  const sentence = faker.lorem.words(wordCount)

  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

export const createProject = () => {
  cy.get('#create-project').should('be.visible').click()
  cy.getCookie('name', {log: true})
  cy.get('[data-cy="arrow-down"]', { timeout: 8000 })
  cy.get('button').contains('Create empty manuscript').click()
  cy.get('#project-title-field', {timeout: 30000})
}

export const insertParagraph = (paragraph) => {
  cy.get('.manuscript-editor').type('{enter}')
  cy.get('.manuscript-editor').type(' ' + paragraph)
  cy.get('p').contains(paragraph) 
}