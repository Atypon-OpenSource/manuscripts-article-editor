import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import ArrowUpBlue from '@manuscripts/assets/react/ArrowUpBlue'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ResearchField } from '../../types/templates'
import { TemplateTopicsList } from './TemplateTopicsList'

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
`

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${props => props.theme.colors.sidebar.text.primary};
  margin-right: 8px;
`

interface Props {
  handleChange: (value: ResearchField | null) => void
  options: ResearchField[]
  value: ResearchField | null
}

interface State {
  isOpen: boolean
}

export class TemplateTopicSelector extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isOpen: false,
  }

  public render() {
    const { isOpen } = this.state
    const { options, handleChange, value } = this.props

    return (
      <div>
        <Header onClick={() => this.setState({ isOpen: !isOpen })}>
          <Title>{value ? value.name : 'All Topics'}</Title>

          {isOpen ? (
            <ArrowUpBlue data-cy={'arrow-up'} />
          ) : (
            <ArrowDownBlue data-cy={'arrow-down'} />
          )}
        </Header>

        {isOpen && (
          <TemplateTopicsList
            handleChange={value => {
              this.setState({ isOpen: false })
              handleChange(value)
            }}
            options={options}
            value={value}
          />
        )}
      </div>
    )
  }
}
