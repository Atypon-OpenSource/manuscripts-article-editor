import React from 'react'
import { IconProps } from './types'

const ProjectClock = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle
        transform="rotate(180 13.5 13.542)"
        cx={15.017}
        cy={15.042}
        r={9.25}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <rect fill="currentColor" x={11} y={7} width={2} height={7} rx={1} />
    </g>
  </svg>
)

export default ProjectClock
