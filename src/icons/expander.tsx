import React from 'react'
import { theme } from '../theme'
import { IconProps } from './types'

const Expander = (props: IconProps) => (
  <svg width={props.size || 20} height={props.size || 20} {...props}>
    <g transform="matrix(1 0 0 -1 0 20)" fill="none" fillRule="evenodd">
      <circle stroke="#D8D8D8" cx={10} cy={10} r={9} />
      <path
        stroke={props.color || theme.colors.icon.primary}
        strokeWidth={2}
        strokeLinecap="round"
        d="M6.505 10.974l3.548-3 3.652 2.96"
      />
    </g>
  </svg>
)

export default Expander
