import { generateUser, login, signup, createProject, generateName } from './helpers'

describe('Authors', () => {
    const user = generateUser()
    
    before(() => {
        signup(user, true)
    })

    it('Author name is shown as first name initial and surname ', () => {
        login(user, true)

        const initial = user.name.slice(0, 1)
        const surname = user.name.split(' ').slice(-1)

        createProject()
        cy.get('[data-cy="author-container"]').contains(initial + '. ' + surname)
    })

    it('Can hide the author container ', () => {
        login(user, true)

        createProject()
        cy.get('[data-cy="expander-button"]').click()
        cy.get('[data-cy="author-container"]').should('not.exist')
    })

    it('Can click on Edit Author button when hovering over the author name ', () => {
        login(user, true)

        createProject()
        cy.get('[data-cy="author-container"]').contains('Edit Authors').invoke('show').click()
        cy.get('[data-cy="authors-sidebar"]').contains('Authors')
        cy.get('[data-cy="author-details"]').contains('Author Details')
    })

    it('Can search for a new author by name', () => {
        login(user, true)

        const author = generateName()

        createProject()
        cy.get('[data-cy="author-container"]').contains('Edit Authors').invoke('show').click()
        cy.get('[data-cy="authors-sidebar"]').find('button').contains('New Author').click()
        cy.get('input').type(author)
        cy.get('[data-cy="sidebar-text"]').contains('No matches found.')
        cy.get('[data-cy="sidebar-text"]').contains('Do you want to create a new author or invite a new Collaborator to be added to the author list?')
    })

    it('Can create a new author', () => {
        login(user, true)

        const author = generateName()

        createProject()
        cy.get('[data-cy="author-container"]').contains('Edit Authors').invoke('show').click()
        cy.get('[data-cy="authors-sidebar"]').find('button').contains('New Author').click()
        cy.get('input').type(author)
        cy.get('button').contains('Create').click()
        cy.get('[data-cy="add-author-message"]').contains('You added 1 author')
    })

    it('Can cancel the creation of a new author', () => {
        login(user, true)

        const author = generateName()

        createProject()
        cy.get('[data-cy="author-container"]').contains('Edit Authors').invoke('show').click()
        cy.get('[data-cy="authors-sidebar"]').find('button').contains('New Author').click()
        cy.get('input').type(author)
        cy.get('button').contains('Cancel').click()
        cy.get('[data-cy="authors-sidebar"]').find('button').contains('New Author')
    })

    it('A new author is shown on the project page', () => {
        login(user, true)

        const author = generateName()
        const initial = author.slice(0, 1)
        const surname = author.split(' ').slice(-1)

        createProject()
        cy.get('[data-cy="author-container"]').contains('Edit Authors').invoke('show').click()
        cy.get('[data-cy="authors-sidebar"]').find('button').contains('New Author').click()
        cy.get('input').type(author)
        cy.get('button').contains('Create').click()
        cy.get('[data-cy="modal-close-button"]').click()
        cy.get('[data-cy="author-container"]').contains(initial + '. ' + surname)
    })
})
