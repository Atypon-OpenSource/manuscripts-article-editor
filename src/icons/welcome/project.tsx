import React from 'react'
import { IconProps } from '../index'

const Project = (props: IconProps) => (
  <svg width={props.size} height={props.size} viewBox="0 0 42 48" {...props}>
    <title>{props.title}</title>
    <g transform="translate(3 3)" fill="none" fillRule="evenodd">
      <rect
        stroke="#7FB5D5"
        strokeWidth={2.5}
        x={-1.25}
        y={-1.25}
        width={38.5}
        height={44.5}
        rx={3}
      />
      <rect fill="#93C1DC" x={6} y={9} width={15} height={3} rx={1} />
      <rect fill="#93C1DC" x={6} y={20} width={24} height={3} rx={1} />
      <rect fill="#93C1DC" x={6} y={31} width={24} height={3} rx={1} />
    </g>
  </svg>
)

export default Project
