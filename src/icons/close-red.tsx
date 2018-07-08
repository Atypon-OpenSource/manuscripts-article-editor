import React from 'react'
import { IconProps } from './types'

const CloseRed = (props: IconProps) => (
  <svg width={10} height={10} {...props}>
    <title>Closered@1x</title>
    <g fill="#F5C1B7" fillRule="evenodd">
      <rect
        transform="rotate(-45 5 5)"
        x={-1.154}
        y={4.231}
        width={12.308}
        height={1.538}
        rx={0.769}
      />
      <rect
        transform="scale(1 -1) rotate(-45 -7.071 0)"
        x={-1.154}
        y={4.231}
        width={12.308}
        height={1.538}
        rx={0.769}
      />
    </g>
  </svg>
)

export default CloseRed
