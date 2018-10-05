import { typeset } from '../mathjax'

describe('mathjax', () => {
  it('generate', () => {
    const tex = '\\sqrt{2}-z_{foo}=\\sum{x}'
    expect(typeset(tex, false)).toMatchSnapshot('mathjax')
    expect(typeset(tex, true)).toMatchSnapshot('mathjax-display')
  })
})
