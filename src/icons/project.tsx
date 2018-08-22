import React from 'react'
import { IconProps } from './types'

const ProjectIcon = (props: IconProps) => (
  <svg width={props.size || 18} height={props.size || 19} {...props}>
    <g
      transform="translate(2 2)"
      stroke="currentColor"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        strokeWidth={1.5}
        fill="#FFF"
        x={-0.75}
        y={-0.75}
        width={13.5}
        height={15.5}
        rx={1}
      />
      <rect x={2.5} y={2.5} width={4} height={1} rx={0.5} />
      <rect x={2.5} y={6.5} width={7} height={1} rx={0.5} />
      <rect x={2.5} y={10.5} width={7} height={1} rx={0.5} />
    </g>
  </svg>
)

export default ProjectIcon
