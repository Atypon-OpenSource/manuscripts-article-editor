import React from 'react'
import { IconProps } from './types'

const AttentionWarning = (props: IconProps) => (
  <svg width={24} height={24} {...props}>
    <title>AttentionOrange@1x</title>
    <g fill="none" fillRule="evenodd">
      <circle fill="#E28327" cx={12} cy={18.7} r={1} />
      <rect fill="#E28327" x={11.12} y={7.5} width={1.8} height={9} rx={0.9} />
      <path
        d="M12.901 1.98l9.41 19.587a1 1 0 0 1-.9 1.433H2.59a1 1 0 0 1-.901-1.433l9.41-19.586a1 1 0 0 1 1.802 0z"
        stroke="#E28327"
        strokeWidth={1.5}
      />
    </g>
  </svg>
)

export default AttentionWarning
