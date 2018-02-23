import { styled } from '../theme'

export const TextField = styled.input`
  display: block;
  font-size: 16px;
  padding: 10px 15px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #aaa;
  border-radius: 5px;

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

export const FirstTextField = TextField.extend`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-top: 5px;
  margin-bottom: 0;
`

export const MiddleTextField = TextField.extend`
  border-top: none;
`

export const LastTextField = TextField.extend`
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-bottom: 5px;
`

export const TextFieldLabel = styled.label`
  text-transform: uppercase;
  color: gray;

  & input {
    margin-top: 5px;
  }

  & textarea {
    margin-top: 5px;
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
