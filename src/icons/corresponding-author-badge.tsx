import React from 'react'
import { IconProps } from './types'

const CorrespondingAuthorBadge = (props: IconProps) => (
  <svg width={props.size || 19} height={props.size || 19} {...props}>
    <g fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        <path
          d="M17.17 7.497a2.833 2.833 0 0 1-.83-2.004 2.833 2.833 0 0 0-2.833-2.833 2.833 2.833 0 0 1-2.004-.83 2.833 2.833 0 0 0-4.007 0 2.834 2.834 0 0 1-2.003.83A2.833 2.833 0 0 0 2.66 5.493c0 .751-.299 1.472-.83 2.003a2.833 2.833 0 0 0 0 4.007c.531.532.83 1.253.83 2.004a2.833 2.833 0 0 0 2.833 2.833c.751 0 1.472.299 2.003.83a2.833 2.833 0 0 0 4.007 0 2.833 2.833 0 0 1 2.004-.83 2.833 2.833 0 0 0 2.833-2.833c0-.752.299-1.472.83-2.004a2.833 2.833 0 0 0 0-4.006z"
          fill="#6E76E5"
        />
        <path
          d="M9.503 16A6.502 6.502 0 0 1 3.01 9.505 6.502 6.502 0 0 1 9.503 3.01 6.503 6.503 0 0 1 16 9.505 6.503 6.503 0 0 1 9.503 16zm0-12.064a5.574 5.574 0 0 0-5.568 5.569 5.574 5.574 0 0 0 5.568 5.568 5.575 5.575 0 0 0 5.569-5.568 5.575 5.575 0 0 0-5.569-5.569z"
          fill="#FFF"
        />
      </g>
      <text
        fontFamily="Barlow-Bold, Barlow"
        fontSize={13}
        fontWeight="bold"
        letterSpacing={-0.267}
        fill="#FFF"
      >
        <tspan x={7} y={17}>
          *
        </tspan>
      </text>
    </g>
  </svg>
)

export default CorrespondingAuthorBadge
