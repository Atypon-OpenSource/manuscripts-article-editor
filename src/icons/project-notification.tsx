import React from 'react'
import { IconProps } from './types'

const ProjectNotification = (props: IconProps) => (
  <svg width={24} height={26} {...props}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(3 9)" stroke="#7FB5D5">
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
      <circle fill="#FFF" fillRule="nonzero" cx={17} cy={7} r={7} />
      <g transform="translate(11 1)" fillRule="nonzero">
        <circle fill="#80BE86" cx={6} cy={6} r={6} />
        <circle
          stroke="#FFF"
          strokeWidth={0.5}
          fill="#FFF"
          cx={6}
          cy={9}
          r={1}
        />
        <path
          className={'user-icon-path'}
          d="M5.875 2.5c.207 0 .375.168.375.375v3.25a.375.375 0 1 1-.75 0v-3.25c0-.207.168-.375.375-.375z"
          stroke="#FFF"
          strokeWidth={0.5}
          fill="#FFF"
        />
      </g>
    </g>
  </svg>
)

export default ProjectNotification
