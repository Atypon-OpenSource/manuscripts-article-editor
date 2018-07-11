import { generate } from '../mathjax'

describe('mathjax', () => {
  it('generate', () => {
    const doc = new HTMLDocument()
    const container = doc.createElement('div')
    doc.appendChild(container)
    expect(
      generate(container, '\\sqrt{2}-z_{foo}=\\sum{x}', false)
    ).toMatchSnapshot()
    expect(
      generate(container, '\\sqrt{2}-z_{foo}=\\sum{x}', true)
    ).toMatchSnapshot()

    expect(generate(container, null, true)).toMatchSnapshot()
  })
})
