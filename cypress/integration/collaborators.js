import { generateUser, login, signup, createProject, generateName } from './helpers'
import faker from 'faker'

describe('Collaborators', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Can navigate to the Collaborators view with a keyboard shortcut', () => {
        login(user, true)

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('Collaborators')
        cy.get('[data-cy="sidebar"]').contains('New Collaborator')
        cy.get('[data-cy="collaborators-page"]').contains('Add Collaborator')
    })

    it('Can navigate to the Collaborators view by clicking on the Collaborator icon on the side', () => {
        login(user, true)

        createProject()
        cy.wait(1500)
        cy.get('[data-cy="collaborators"]').click()
        cy.get('[data-cy="sidebar"]').contains('Collaborators')
        cy.get('[data-cy="sidebar"]').contains('New Collaborator')
        cy.get('[data-cy="collaborators-page"]').contains('Add Collaborator')
    })

    it('Shows a message when a collaborator does not exists yet and asks to invite them', () => {
        login(user, true)

        const collaborator = generateName()

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('New Collaborator').click()
        cy.get('input').type(collaborator)
        cy.get('[data-cy="sidebar-text"]').contains('No matches found.')
        cy.get('[data-cy="sidebar-text"]').contains(`Do you want to invite ${collaborator}?`)
    })

    it('Can click on Invite to invite a new collaborator', () => {
        login(user, true)

        const collaborator = generateName()

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('New Collaborator').click()
        cy.get('input').type(collaborator)
        cy.get('button').contains('Invite').click()
        cy.get('input[name="name"]').type(collaborator)
        cy.get('button').contains('Send Invitation')
        cy.get('[type="radio"]').check('Writer').should('be.checked')
    })

    it('Can cancel the search for a collaborator', () => {
        login(user, true)

        const collaborator = generateName()

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('New Collaborator').click()
        cy.get('input').type(collaborator)
        cy.get('button').contains('Cancel').click()
        cy.get('[data-cy="sidebar"]').contains('New Collaborator')
    })

    it('Email field cannot be blank when inviting a collaborator', () => {
        login(user, true)

        const collaborator = generateName()

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('New Collaborator').click()
        cy.get('input').type(collaborator)
        cy.get('button').contains('Invite').click()
        cy.get('button').contains('Send Invitation').click()
    })

    it('Can make a collaborator an owner of a project', () => {
        login(user, true)

        const collaborator = generateName()

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('New Collaborator').click()
        cy.get('input').type(collaborator)
        cy.get('button').contains('Invite').click()
        cy.get('[type="radio"]').first().check({force: true})
        cy.get('[type="radio"]').check('Owner').should('be.checked')
    })

    it('Can make a collaborator a reader of a project', () => {
        login(user, true)

        const collaborator = generateName()

        createProject()
        cy.wait(1500)
        cy.get('body').type('{option}{cmd}5', { release: false })
        cy.get('[data-cy="sidebar"]').contains('New Collaborator').click()
        cy.get('input').type(collaborator)
        cy.get('button').contains('Invite').click()
        cy.get('[type="radio"]').last().check({force: true})
        cy.get('[type="radio"]').check('Viewer').should('be.checked')
    })
})