import faker from 'faker'
import { Selector } from 'testcafe'

const BASE_URL = process.env.BASE_URL || 'http://0.0.0.0:8080'

const timestamp = () => Math.floor(Date.now() / 1000)

export const generateUser = () => ({
  email: timestamp() + '-' + faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
})

export const signup = async (t, user, confirm) => {
  await t.navigateTo(BASE_URL + '/signup')

  const form = Selector('#signup-form')

  await t
    .typeText(form.find('input[name=name]'), user.name)
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))

  if (confirm) {
    await Selector('#signup-confirm')()
  }
}

export const login = async (t, user, confirm) => {
  await t.navigateTo(BASE_URL + '/login')

  const form = Selector('#login-form')

  await t
    .typeText(form.find('input[name=email]'), user.email)
    .typeText(form.find('input[name=password]'), user.password)
    .click(form.find('button[type=submit]'))

  if (confirm) {
    await Selector('#user-dropdown')()
  }
}

export const loginAsNewUser = async t => {
  const user = generateUser()
  await signup(t, user, true)
  await login(t, user, true)

  return user
}

// replace any non-breaking spaces (ASCII 160) in a text with a regular space
export const normaliseWhitespace = text => text.replace(/\u00a0/g, ' ')

// replace any /n /r strings in a text with a double space
export const normaliseLineReturn = text => text.replace(/(\r\n|\n|\r)/gm,"  ")

export const generateTitle = wordCount => {
  const sentence = faker.lorem.words(wordCount)

  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

export const generateParagraph = paragraphCount => {
  return faker.lorem.paragraphs(paragraphCount)
}

export const enterRichText = (t, selector, text) =>
  t.click(selector).typeText(selector, text, {
    paste: true,
    replace: true,
  })

export const confirmRichText = async (t, selector, text) =>
  t.expect(normaliseWhitespace(await selector.textContent)).eql(text)
