import React from 'react'
import { IconProps } from './types'

const Close = (props: IconProps) => (
  <svg width={props.size} height={props.size} viewBox="0 0 26 26" {...props}>
    <title>{props.title}</title>
    <g fill="#939FAD" fillRule="evenodd">
      <rect
        transform="rotate(-45 13 13)"
        x={-3}
        y={11}
        width={32}
        height={4}
        rx={2}
      />
      <rect
        transform="scale(1 -1) rotate(-45 -18.385 0)"
        x={-3}
        y={11}
        width={32}
        height={4}
        rx={2}
      />
    </g>
  </svg>
)

export default Close
