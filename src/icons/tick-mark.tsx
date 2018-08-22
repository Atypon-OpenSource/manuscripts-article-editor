import React from 'react'
import { IconProps } from './types'

const TickMark = (props: IconProps) => (
  <svg width={12} height={8.5} {...props}>
    <path
      d="M2.642 3.99a1.101 1.101 0 0 0-1.47.011l.228-.214c-.4.376-.39.98.02 1.346L4.207 7.62a1.147 1.147 0 0 0 1.488.004l5.846-5.193a.853.853 0 0 0-.004-1.316l.235.206a1.168 1.168 0 0 0-1.497.003L4.912 6.032 2.642 3.99z"
      fill={props.color || '#FFF'}
      fillRule="nonzero"
    />
  </svg>
)

export default TickMark
