import React from 'react'
import { powderBlue } from '../../colors'
import SearchIcon from '../../icons/search'
import {
  SidebarSearchField,
  SidebarSearchIconContainer,
  SidebarSearchText,
} from '../Sidebar'

interface Props {
  value: string
  handleChange: (value: string) => void
}

interface State {
  searching: boolean
}

export class TemplateSearchInput extends React.Component<Props, State> {
  public state: Readonly<State> = {
    searching: false,
  }

  public render() {
    return (
      <SidebarSearchField
        onFocus={() => {
          this.setState({
            searching: true,
          })
        }}
        onBlur={() => {
          this.setState({
            searching: false,
          })
        }}
      >
        <SidebarSearchIconContainer>
          {this.state.searching ? (
            <SearchIcon color={powderBlue} />
          ) : (
            <SearchIcon />
          )}
        </SidebarSearchIconContainer>
        <SidebarSearchText
          type={'search'}
          value={this.props.value}
          placeholder={'Search'}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            this.props.handleChange(event.currentTarget.value)
          }
        />
      </SidebarSearchField>
    )
  }
}
