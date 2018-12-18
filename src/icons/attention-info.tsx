import React from 'react'
import { IconProps } from './types'

const AttentionInfo = (props: IconProps) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    {...props}
    transform={'rotate(180)'}
  >
    <path
      d="M12 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.2 1.5 12 1.5zM12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.372 0 12 0zm0 18.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12.02 6a.9.9 0 0 0-.9.9v7.2a.9.9 0 1 0 1.8 0V6.9a.9.9 0 0 0-.9-.9z"
      fill={props.color || '#2A6F9D'}
      fillRule="evenodd"
    />
  </svg>
)

export default AttentionInfo
