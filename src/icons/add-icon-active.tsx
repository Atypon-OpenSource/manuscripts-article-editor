import React from 'react'
import { IconProps } from './types'

const AddIconActive = (props: IconProps) => (
  <svg width={32} height={34} {...props}>
    <g stroke={props.color || '#FFE185'} fill="none" fillRule="evenodd">
      <path
        d="M20 3.144a8 8 0 0 0-8 0L6 6.608a8 8 0 0 0-4 6.928v6.928a8 8 0 0 0 4 6.928l6 3.464a8 8 0 0 0 8 0l6-3.464a8 8 0 0 0 4-6.928v-6.928a8 8 0 0 0-4-6.928l-6-3.464z"
        strokeWidth={2}
      />
    </g>
  </svg>
)

export default AddIconActive
