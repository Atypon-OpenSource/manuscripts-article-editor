import * as React from 'react'
import { styled } from '../theme'

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`

export const SearchInput = styled.input.attrs({
  type: 'search',
})`
  flex: 1;
  padding: 10px;
  margin: 10px;
  font-size: 20px;
`

export const Sort = styled.select`
  font-size: 12px;
`

export const Search = () => (
  <SearchContainer>
    <SearchInput />
    <div>
      <Sort>
        <option value="name">by name</option>
      </Sort>
    </div>
  </SearchContainer>
)
