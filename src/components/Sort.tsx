import React from 'react'
import SortIcon from '../icons/sort'
import { styled } from '../theme'

export const Select = styled.select`
  font-size: 16px;
  border: none;
  background: none;
  color: #585858;
  font-weight: 600;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
`

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin: 10px 40px;
`

const SortIconContainer = styled.div`
  background-color: #585858;
  padding: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-right: 15px;
`

export const Sort: React.SFC = ({ children }) => (
  <SortContainer>
    <SortIconContainer>
      <SortIcon size={12} color={'#fff'} />
    </SortIconContainer>
    {children}
  </SortContainer>
)
