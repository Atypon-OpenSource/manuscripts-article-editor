import React from 'react'
import { IconProps } from './types'

const ProjectEdit = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    <g
      transform="translate(6 5)"
      stroke="currentColor"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        strokeWidth={1.5}
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

export default ProjectEdit
