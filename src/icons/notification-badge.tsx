import React from 'react'
import { IconProps } from './types'

const NotificationBadge = (props: IconProps) => (
  <svg width={props.size || 10} height={props.size || 10} {...props}>
    <circle
      cx={props.size ? props.size / 2 : 5}
      cy={props.size ? props.size / 2 : 5}
      r={props.size ? props.size / 2 : 5}
      fill={props.color || 'currentColor'}
      fillRule="nonzero"
    />
  </svg>
)

export default NotificationBadge
