import React from 'react'
import { IconProps } from './types'

const DropdownToggle = (props: IconProps) => (
  <svg width={props.size || 12} height={props.size || 8} {...props}>
    <path
      d="M2 2l3.942 4L10 2.053"
      stroke={props.color || '#353535'}
      strokeWidth={1.6}
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
    />
  </svg>
)

export default DropdownToggle
