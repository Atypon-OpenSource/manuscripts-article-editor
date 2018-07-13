import React from 'react'
import { IconProps } from './types'

const Hamburger = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    <g transform="translate(3 6)" fill="currentColor" fillRule="evenodd">
      <rect width={18} height={2} rx={1} />
      <rect
        stroke="currentColor"
        x={0.5}
        y={5.5}
        width={17}
        height={1}
        rx={0.5}
      />
      <rect
        stroke="currentColor"
        x={0.5}
        y={10.5}
        width={17}
        height={1}
        rx={0.5}
      />
    </g>
  </svg>
)

export default Hamburger
