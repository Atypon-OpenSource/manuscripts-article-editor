import React from 'react'
import { IconProps } from '../types'

const AddFile = (props: IconProps) => (
  <svg width={props.size} height={props.size} viewBox="0 0 32 34" {...props}>
    <title>{props.title}</title>
    <g fill="none" fillRule="evenodd">
      <path
        d="M20.5 2.278l6 3.464a9 9 0 0 1 4.5 7.794v6.928a9 9 0 0 1-4.5 7.794l-6 3.464a9 9 0 0 1-9 0l-6-3.464A9 9 0 0 1 1 20.464v-6.928a9 9 0 0 1 4.5-7.794l6-3.464a9 9 0 0 1 9 0z"
        fill="#FDCD47"
      />
      <path
        d="M15.255 15.707v-6a.75.75 0 1 1 1.5 0v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 1 1 0-1.5h6z"
        stroke="#FFF"
        fill="#FFF"
      />
    </g>
  </svg>
)

export default AddFile
