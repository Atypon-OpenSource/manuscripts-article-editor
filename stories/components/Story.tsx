import { styled } from '../../src/theme/styled-components'

export const Story = styled.div`
  background-color: ${props => props.theme.colors.global.background.default};
  color: ${props => props.theme.colors.global.text.primary};
  font-family: ${props => props.theme.fontFamily};
  padding: 3rem;
`
