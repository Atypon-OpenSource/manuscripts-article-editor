import React from 'react'
import Select from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { plainStyles } from './select'

interface OptionType {
  label: string
  value: string
}

interface Props {
  options: OptionsType<OptionType>
  portal: HTMLDivElement
  selectRef: React.RefObject<Select<OptionType>>
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
    options={options}
    value={options.find(option => option.value === selected)}
    onChange={(option: OptionType) => {
      if (option.value) {
        handleChange(option.value)
      }
    }}
    menuPortalTarget={portal}
    openMenuOnFocus={true}
    styles={plainStyles}
  />
)
