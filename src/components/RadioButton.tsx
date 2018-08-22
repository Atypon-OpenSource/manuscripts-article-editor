import React, { InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import {
  dustyGrey,
  manuscriptsBlue,
  manuscriptsGrey,
  mercuryGrey,
} from '../colors'

const CustomRadioButton = styled.div`
  position: absolute;
  top: 2px;
  left: 0;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  border: solid 1px ${dustyGrey};

  &:after {
    position: absolute;
    display: none;
    content: '';
  }
`

const TextHint = styled.span`
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.2px;
  text-align: left;
  color: ${dustyGrey};
  clear: both;
  display: block;
  padding-bottom: 10px;
`

const Control = styled.label`
  font-size: 18px;
  white-space: normal;
  font-weight: 300;
  position: relative;
  display: block;
  line-height: 1.06;
  letter-spacing: normal;
  color: ${manuscriptsGrey};
  padding-left: 30px;
  cursor: pointer;

  & input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  &:hover input ~ ${CustomRadioButton} {
    background-color: #e0eef9;
  }

  &:hover input:checked:enabled ~ ${CustomRadioButton} {
    background-color: ${manuscriptsBlue};
  }

  & input:disabled ~ ${CustomRadioButton} {
    background-color: ${mercuryGrey};
  }

  & ${CustomRadioButton}:after {
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${manuscriptsBlue};
  }

  & input:checked ~ ${CustomRadioButton}:after {
    display: block;
  }

  & ${TextHint} {
    margin: 4px 0 6px;
  }
`

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  textHint?: string
}

export const RadioButton: React.SFC<Props> = ({
  children,
  textHint,
  ...rest
}) => (
  <Control>
    <input {...rest} type={'radio'} />
    <CustomRadioButton />
    {children}
    {textHint && <TextHint>{textHint}</TextHint>}
  </Control>
)
