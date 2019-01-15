import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import React from 'react'
import { aliceBlue, dustyGrey } from '../../colors'
import { styled } from '../../theme'
import { ResearchField } from '../../types/templates'

const ListContainer = styled.div`
  position: relative;
  bottom: 12px;
  z-index: 2;
`

const List = styled.div`
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  max-height: 50vh;
  overflow-y: auto;
  margin: 0 20px;
  width: 85%;
  position: absolute;
`

const ListSection = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.primary.grey};
  cursor: pointer;

  &:hover {
    background-color: ${aliceBlue};
  }
`

const Separator = styled.div`
  height: 1px;
  opacity: 0.23;
  background-color: ${dustyGrey};
`

const AddedIconContainer = styled.span`
  display: inline-flex;
  width: 32px;
  height: 1em;
  align-items: center;
  justify-content: center;
`

const Added: React.FunctionComponent<{ visible: boolean }> = ({ visible }) => (
  <AddedIconContainer>
    {visible && <AddedIcon width={16} height={16} viewBox={'0 0 32 34'} />}
  </AddedIconContainer>
)

interface Props {
  handleChange: (value: ResearchField | null) => void
  options: ResearchField[]
  value: ResearchField | null
}

export const TemplateTopicsList: React.FunctionComponent<Props> = ({
  handleChange,
  options,
  value,
}) => (
  <ListContainer data-cy={'template-topics-list'}>
    <List>
      <ListSection onClick={() => handleChange(null)}>
        <Added visible={!value} />
        All Topics
      </ListSection>

      <Separator />

      {options.sort((a, b) => a.name.localeCompare(b.name)).map(topic => (
        <ListSection key={topic._id} onClick={() => handleChange(topic)}>
          <Added visible={value ? value._id === topic._id : false} />
          {topic.name}
        </ListSection>
      ))}
    </List>
  </ListContainer>
)
