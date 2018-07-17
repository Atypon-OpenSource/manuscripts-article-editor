import { loginAsNewUser } from './helpers'
import { Selector } from 'testcafe'
import faker from 'faker'

fixture('Projects')

const normaliseWhitespace = text => text.replace(/\u00a0/g, ' ')

const generateTitle = wordCount => {
  const sentence = faker.lorem.words(wordCount)

  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

const enterRichText = async (t, container, text) => {
  const selector = container.find('[contenteditable]')

  // focus the rich text editor
  await t.click(selector).expect(selector.hasClass('ProseMirror-focused'))

  // delete the existing content
  await t
    .pressKey('ctrl+a delete') // TODO: meta+a?
    .expect(selector.textContent)
    .eql('')

  // enter the new text
  await t.typeText(selector, text)
}

test('Can create a new project and edit titles', async t => {
  await loginAsNewUser(t)

  await t.click(Selector('#create-project'))

  const projectTitleField = Selector('#project-title-field')
  const manuscriptTitleField = Selector('#manuscript-title-field')

  await t.expect(projectTitleField.textContent).eql('Untitled Project')
  await t.expect(manuscriptTitleField.textContent).eql('')

  const projectTitle = generateTitle(3)
  const manuscriptTitle = generateTitle(
    faker.random.number({
      max: 10,
      min: 3,
    })
  )

  await enterRichText(t, projectTitleField, projectTitle)
  await enterRichText(t, manuscriptTitleField, manuscriptTitle)

  await t
    .expect(normaliseWhitespace(await projectTitleField.textContent))
    .eql(projectTitle)
  await t
    .expect(normaliseWhitespace(await manuscriptTitleField.textContent))
    .eql(manuscriptTitle)
})
