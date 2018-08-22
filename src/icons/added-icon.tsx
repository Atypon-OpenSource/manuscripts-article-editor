import React from 'react'
import { IconProps } from './types'

const AddedIcon = (props: IconProps) => (
  <svg width={32} height={34} {...props}>
    <g fill="none" fillRule="evenodd">
      <g stroke="#FFE185">
        <path
          d="M20 3.144a8 8 0 0 0-8 0L6 6.608a8 8 0 0 0-4 6.928v6.928a8 8 0 0 0 4 6.928l6 3.464a8 8 0 0 0 8 0l6-3.464a8 8 0 0 0 4-6.928v-6.928a8 8 0 0 0-4-6.928l-6-3.464z"
          strokeWidth={2}
        />
        <path
          d="M15.25 15.75v-6a.75.75 0 1 1 1.5 0v6h6a.75.75 0 1 1 0 1.5h-6v6a.75.75 0 1 1-1.5 0v-6h-6a.75.75 0 1 1 0-1.5h6z"
          fill="#FFE185"
        />
      </g>
      <path
        d="M20.5 2.278l6 3.464a9 9 0 0 1 4.5 7.794v6.928a9 9 0 0 1-4.5 7.794l-6 3.464a9 9 0 0 1-9 0l-6-3.464A9 9 0 0 1 1 20.464v-6.928a9 9 0 0 1 4.5-7.794l6-3.464a9 9 0 0 1 9 0z"
        fill="#80BE86"
      />
      <path
        d="M12.355 17.264a1.094 1.094 0 0 0-1.468.023l-.148.143a.91.91 0 0 0 .022 1.358l3.634 3.258 8.81-8.002a.878.878 0 0 0-.011-1.333l-.154-.137a1.139 1.139 0 0 0-1.492.004l-7.205 6.469-1.988-1.783z"
        fill="#FFF"
      />
    </g>
  </svg>
)

export default AddedIcon
