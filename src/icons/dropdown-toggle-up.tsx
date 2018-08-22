import React from 'react'
import { IconProps } from './types'

const DropdownToggleUp = (props: IconProps) => (
  <svg width={12} height={8} {...props}>
    <path
      d="M10 6L6.058 2 2 5.947"
      stroke={props.color || 'currentColor'}
      strokeWidth={1.6}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
    />
  </svg>
)

export default DropdownToggleUp
