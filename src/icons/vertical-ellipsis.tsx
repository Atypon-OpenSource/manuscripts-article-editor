import React from 'react'
import { IconProps } from './types'

const VerticalEllipsis = (props: IconProps) => (
  <svg width={6} height={props.size || 22} {...props}>
    <g
      transform="translate(1 1)"
      fill={props.color || '#7FB5D5'}
      fillRule="evenodd"
    >
      <rect width={4} height={4} rx={2} />
      <rect y={8} width={4} height={4} rx={2} />
      <rect y={16} width={4} height={4} rx={2} />
    </g>
  </svg>
)

export default VerticalEllipsis
