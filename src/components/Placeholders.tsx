import React from 'react'
import { styled } from '../theme/styled-components'
import {
  IndicatorKind,
  IndicatorSize,
  ProgressIndicator,
} from './ProgressIndicator'

const PlaceholderContainer = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ManuscriptPlaceholder: React.FunctionComponent = () => (
  <PlaceholderContainer>
    <ProgressIndicator
      isDeterminate={false}
      size={IndicatorSize.Large}
      symbols={IndicatorKind.Project}
    />
  </PlaceholderContainer>
)

export const ProjectPlaceholder: React.FunctionComponent = () => (
  <PlaceholderContainer>
    <ProgressIndicator
      isDeterminate={false}
      size={IndicatorSize.Large}
      symbols={IndicatorKind.Project}
    />
  </PlaceholderContainer>
)
