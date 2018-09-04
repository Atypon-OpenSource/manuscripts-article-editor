import React from 'react'
import ReactSelectClass, { Creatable, Option, Options } from 'react-select'
import { Keyword } from '../../types/components'
import { plainStyles } from './select'

interface Props {
  options: Options<string>
  portal: Node
  selectRef: React.RefObject<ReactSelectClass>
  selected: string
  handleChange: (id?: string) => void
  handleCreate: (name: string) => Promise<Keyword>
}

interface State {
  isLoading: boolean
  options: Options<string>
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
      <Creatable
        ref={selectRef}
        autosize={true}
        isLoading={isLoading}
        options={options}
        value={value}
        onChange={(option: Option<string>) => {
          if (option.value) {
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

          const option = {
            value: keyword.id,
            label: keyword.name,
          }

          this.setState(state => ({
            ...state,
            isLoading: false,
            options: [...state.options, option],
            selected: option.value,
          }))

          this.props.handleChange(option.value)
        }}
      />
    )
  }
}
