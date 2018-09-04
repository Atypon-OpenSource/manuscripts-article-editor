import React from 'react'
import { FormattedRelative } from 'react-intl'
import { styled } from '../theme'

interface RelativeDateProps {
  createdAt?: number
}

export const RelativeDate: React.SFC<RelativeDateProps> = ({ createdAt }) =>
  createdAt ? <FormattedRelative value={createdAt * 1000} /> : null

export const LightRelativeDate = styled(RelativeDate)`
  font-size: 12px;
  color: #949494;
  letter-spacing: -0.2px;
`
