import { styled, ThemedProps } from '../../src/theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

export const Story = styled.div`
  background-color: ${(props: ThemedDivProps) =>
    props.theme.colors.global.background.default};
  color: ${(props: ThemedDivProps) => props.theme.colors.global.text.primary};
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  padding: 3rem;
`
