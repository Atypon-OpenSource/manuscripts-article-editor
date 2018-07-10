import React from 'react'
import { IconProps } from './types'

const JointFirstAuthorBadge = (props: IconProps) => (
  <svg width={props.size || 19} height={props.size || 19} {...props}>
    <g fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        <path
          d="M17.17 7.497a2.833 2.833 0 0 1-.83-2.004 2.833 2.833 0 0 0-2.833-2.833 2.833 2.833 0 0 1-2.004-.83 2.833 2.833 0 0 0-4.007 0 2.834 2.834 0 0 1-2.003.83A2.833 2.833 0 0 0 2.66 5.493c0 .751-.299 1.472-.83 2.003a2.833 2.833 0 0 0 0 4.007c.531.532.83 1.253.83 2.004a2.833 2.833 0 0 0 2.833 2.833c.751 0 1.472.299 2.003.83a2.833 2.833 0 0 0 4.007 0 2.833 2.833 0 0 1 2.004-.83 2.833 2.833 0 0 0 2.833-2.833c0-.752.299-1.472.83-2.004a2.833 2.833 0 0 0 0-4.006z"
          fill="#A8CD95"
        />
        <path
          d="M9.282 15.558A6.28 6.28 0 0 1 3.01 9.284 6.281 6.281 0 0 1 9.282 3.01a6.281 6.281 0 0 1 6.274 6.274 6.281 6.281 0 0 1-6.274 6.274zm0-11.653a5.385 5.385 0 0 0-5.378 5.379 5.385 5.385 0 0 0 5.378 5.378 5.385 5.385 0 0 0 5.38-5.378 5.385 5.385 0 0 0-5.38-5.38z"
          fill="#FFF"
        />
      </g>
      <text
        fontFamily="Barlow-Bold, Barlow"
        fontSize={8}
        fontWeight="bold"
        letterSpacing={-0.164}
        fill="#FFF"
      >
        <tspan x={8} y={12}>
          1
        </tspan>
      </text>
    </g>
  </svg>
)

export default JointFirstAuthorBadge
