import { styled } from '../theme'
import { ErrorProps } from './Form'

export const TextField = styled.input<ErrorProps>`
  display: block;
  font-size: 16px;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${props => (props.error ? '#D47666' : '#aaa')};
  border-radius: 5px;
  z-index: ${props => (props.error ? 2 : 1)};
  position: relative;

  &:invalid {
    box-shadow: none;
  }

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover {
    &::placeholder {
      color: #777;
    }
  }
`

export const TextFieldGroup = styled.div`
  & ${TextField}:first-of-type {
    margin-top: 5px;
  }

  & ${TextField}:last-of-type {
    margin-bottom: 5px;
  }

  & ${TextField}:not(:first-of-type) {
    margin-top: -1px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  & ${TextField}:not(:last-of-type) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 0;
  }
`

export const TextArea = styled.textarea`
  font-size: 16px;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #aaa;
  border-radius: 5px;
  height: 100px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover {
    &::placeholder {
      color: #777;
    }
  }
`

export const TextFieldLabel = styled.label`
  text-transform: uppercase;
  color: gray;

  & ${TextField} {
    margin-top: 5px;
  }

  & ${TextArea} {
    margin-top: 5px;
  }
`
