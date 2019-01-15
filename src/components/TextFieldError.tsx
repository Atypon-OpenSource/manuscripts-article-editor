import React from 'react'
import { styled, ThemedProps } from '../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const Arrow = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  border: 5px solid transparent;
  top: -5px;
  left: calc(16px);
  border-bottom-color: ${(props: ThemedDivProps) =>
    props.theme.colors.alertMessage.error.background};
  border-top-width: 0;
  margin: 0 5px;
`

const Container = styled.div`
  background: ${(props: ThemedDivProps) =>
    props.theme.colors.alertMessage.error.background};
  color: ${(props: ThemedDivProps) =>
    props.theme.colors.alertMessage.error.text};
  border-radius: 2px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
  padding: 4px;
`

export const TextFieldErrorItem = styled.div`
  margin: 8px;
`

export const TextFieldError: React.FunctionComponent = ({ children }) => (
  <Container>
    <Arrow />
    {children}
  </Container>
)
