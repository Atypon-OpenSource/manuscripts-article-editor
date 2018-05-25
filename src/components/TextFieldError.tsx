import React from 'react'
import { styled } from '../theme'

const Arrow = styled.div`
  width: 0;
  height: 0;
  position: absolute;
  border: 5px solid transparent;
  top: -5px;
  left: calc(16px);
  border-bottom-color: #fdf2f0;
  border-top-width: 0;
  margin: 0 5px;
`

const Container = styled.div`
  background: #fdf2f0;
  color: #cd593c;
  //border: 1px solid #e7cdd1;
  border-radius: 2px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative;
  padding: 4px;
`

export const TextFieldErrorItem = styled.div`
  margin: 8px;
`

export const TextFieldError: React.SFC = ({ children }) => (
  <Container>
    <Arrow />
    {children}
  </Container>
)
