import React from 'react'
import { styled } from '../../theme'

export const LibraryPicker = styled.div`
  display: flex;
`

export const LibraryPickerItems = styled.div`
  flex: 1;
`

const Container = styled.div`
  padding: 12px 0;
`

const Content = styled.div`
  padding: 0;
`

const SourceLink = styled.div`
  display: block;
  text-decoration: none;
  padding: 8px 32px;
  cursor: pointer;
  color: inherit;
  border-radius: 5px;
  margin-bottom: 4px;

  &:hover,
  &.active {
    background-color: #5fa2ff;
    color: white;
  }
`

interface Source {
  id: string
  name: string
}

interface Props {
  sources: Source[]
  selectSource: (id: string) => void
  selectedSource: string
}

export const LibraryPickerSources: React.SFC<Props> = ({
  sources,
  selectSource,
  selectedSource,
}) => (
  <Container>
    <Content>
      {sources.map(source => (
        <SourceLink
          key={source.id}
          onClick={() => selectSource(source.id)}
          className={source.id === selectedSource ? 'active' : ''}
        >
          {source.name}
        </SourceLink>
      ))}
    </Content>
  </Container>
)
