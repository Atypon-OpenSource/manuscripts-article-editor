import React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { Keyword } from '../../types/components'
import { plainStyles } from './select'

interface OptionType {
  label: string
  value: string
}

interface Props {
  options: OptionsType<OptionType>
  portal: Node
  selectRef: React.RefObject<CreatableSelect<OptionType>>
  selected: string
  handleChange: (id?: string) => void
  handleCreate: (name: string) => Promise<Keyword>
}

interface State {
  isLoading: boolean
  options: OptionsType<OptionType>
  selected: string
}

export class KeywordSelect extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false,
      options: props.options,
      selected: props.selected,
    }
  }

  public render() {
    const { portal, selectRef } = this.props
    const { isLoading, options, selected } = this.state

    const value = options.find(option => option.value === selected)

    // TODO: sort options?
    // TODO: use menuRenderer to render in popper

    return (
      <CreatableSelect<OptionType>
        ref={selectRef}
        autosize={true}
        isLoading={isLoading}
        options={options}
        value={value}
        onChange={(option?: OptionType) => {
          if (option && option.value) {
            this.props.handleChange(option.value)
          }
        }}
        // @ts-ignore (types are out of date)
        menuPortalTarget={portal}
        openMenuOnFocus={true}
        styles={plainStyles}
        onCreateOption={async (inputValue: string) => {
          this.setState({
            isLoading: true,
          })

          const keyword: Keyword = await this.props.handleCreate(inputValue)

          const option: OptionType = {
            value: keyword._id,
            label: keyword.name,
          }

          this.setState(state => ({
            ...state,
            isLoading: false,
            // options: [],
            options: [...state.options, option],
            selected: option.value,
          }))

          this.props.handleChange(option.value)
        }}
      />
    )
  }
}
