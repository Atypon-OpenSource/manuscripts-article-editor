import React from 'react'
import { FormattedRelative } from 'react-intl'

interface Props {
  createdAt?: number
}

export const RelativeDate: React.FunctionComponent<Props> = ({ createdAt }) =>
  createdAt ? <FormattedRelative value={createdAt * 1000} /> : null
