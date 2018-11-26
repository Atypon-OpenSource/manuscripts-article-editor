import React from 'react'
import { FormattedRelative } from 'react-intl'
import { styled } from '../theme'

interface Props {
  createdAt?: number
  children?: React.ReactNode
}

export const RelativeDate: React.FunctionComponent<Props> = ({ createdAt }) =>
  createdAt ? <FormattedRelative value={createdAt * 1000} /> : null

export const LightRelativeDate = styled(RelativeDate)`
  font-size: 12px;
  color: #949494;
  letter-spacing: -0.2px;
`
