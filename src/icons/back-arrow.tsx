import React from 'react'
import { IconProps } from './types'

export const BackArrow = (props: IconProps) => (
  <svg
    viewBox="0 0 408 408"
    width={props.size || 408}
    height={props.size || 408}
    {...props}
  >
    <path
      d="M408 178.5H96.9L239.7 35.7 204 0 0 204l204 204 35.7-35.7L96.9 229.5H408v-51z"
      fill={props.color || '#000'}
      fillRule="evenodd"
    />
  </svg>
)

export default BackArrow
