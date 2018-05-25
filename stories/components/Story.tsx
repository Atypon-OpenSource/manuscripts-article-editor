import { injectGlobal, styled, ThemedProps } from '../../src/theme'

injectGlobal`
  body {
    margin: 0;
  }
`

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const Story = styled.div`
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.primary.white};
  color: ${(props: ThemedDivProps) => props.theme.colors.primary.black};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  padding: 3rem;
`
