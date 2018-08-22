import React from 'react'
import { IconProps } from './types'

const ShareProjectIcon = (props: IconProps) => (
  <svg width={16} height={21} {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        d="M4.287 5.5c.49.047.735.296.735.747 0 .485-.283.736-.848.753h7.646c-.54-.02-.81-.27-.81-.749 0-.455.245-.705.733-.751H13.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h1.787zM4.044 7L4 6.998h8.013L11.975 7H13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1.044z"
        fill="#7FB5D5"
      />
      <rect fill="#7FB5D5" x={7.25} y={1} width={1.5} height={14} rx={0.75} />
      <path
        stroke="#7FB5D5"
        strokeWidth={1.5}
        strokeLinecap="round"
        d="M4.994 3.012L8.01.384l3.015 2.628"
      />
    </g>
  </svg>
)

export default ShareProjectIcon
