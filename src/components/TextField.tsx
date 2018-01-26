import * as React from 'react'
import styled from 'styled-components'

interface InputProps {
  position?: string
}

const Input = styled('input')`
  font-size: 16px;
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #aaa;
  border-top-left-radius: ${(props: InputProps) =>
    props.position === 'first' ? '5px' : '0px'};
  border-top-right-radius: ${(props: InputProps) =>
    props.position === 'first' ? '5px' : '0px'};
  border-bottom-right-radius: ${(props: InputProps) =>
    props.position === 'last' ? '5px' : '0px'};
  border-bottom-left-radius: ${(props: InputProps) =>
    props.position === 'last' ? '5px' : '0px'};
  border-top-width: ${(props: InputProps) =>
    props.position === 'first' ? '1px' : '0px'};
  margin-top: ${(props: InputProps) =>
    props.position === 'first' ? '5px' : '0px'};
  margin-bottom: ${(props: InputProps) =>
    props.position === 'last' ? '5px' : '0px'};

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

// const Label = styled('label')`
//   color: #779;
//   font-weight: bold;
//   text-transform: uppercase;
// `

interface TextFieldProps {
  name: string
  value: string
  required: boolean
  type: string
  label?: string
  autoFocus?: boolean
  placeholder: string
  position?: string
  isInvalid?: boolean
  onBlur?: (e: React.ChangeEvent<{}>) => void
  onChange?: (e: React.ChangeEvent<{}>) => void
  // label,
}

// TODO: label with id/for

export const TextField = ({
  onChange,
  onBlur,
  name,
  value,
  required,
  type,
  placeholder,
  position,
}: TextFieldProps) => (
  <div>
    {/*{label && <Label>{label}</Label>}*/}

    <Input
      name={name}
      value={value}
      type={type}
      position={position}
      required={required}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  </div>
)
