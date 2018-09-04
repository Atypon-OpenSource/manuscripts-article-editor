import React from 'react'
import Select, { Option, Options } from 'react-select'
import { plainStyles } from './select'

interface Props {
  options: Options
  portal: Node
  selectRef: React.RefObject<Select>
  selected: string
  handleChange: (id?: string) => void
}

export const MentionSelect: React.SFC<Props> = ({
  handleChange,
  options,
  portal,
  selectRef,
  selected,
}) => (
  <Select
    ref={selectRef}
    autosize={true}
    options={options}
    value={options.find(option => option.value === selected)}
    onChange={(option: Option<string>) => {
      if (option.value) {
        handleChange(option.value)
      }
    }}
    // @ts-ignore (types are out of date)
    menuPortalTarget={portal}
    openMenuOnFocus={true}
    styles={plainStyles}
  />
)
