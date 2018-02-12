import { injectGlobal, styled } from '../../src/theme'

injectGlobal`
  body {
    margin: 0;
  }
`

export const Story = styled('div')`
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
  font-family: ${props => props.theme.fontFamily};
  padding: 3rem;
`
