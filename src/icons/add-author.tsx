import React from 'react'
import { IconProps } from './types'

const AddAuthor = (props: IconProps) => (
  <svg
    width={props.size || 38}
    height={props.size || 38}
    viewBox={'0 0 38 38'}
    {...props}
  >
    <defs>
      <circle id="a" cx={18} cy={18} r={18} />
    </defs>
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <use fill={props.color || '#FDCD47'} xlinkHref="#a" />
      <path
        d="M17.305 16.793v-5.6a.7.7 0 0 1 1.4 0v5.6h5.6a.7.7 0 0 1 0 1.4h-5.6v5.6a.7.7 0 0 1-1.4 0v-5.6h-5.6a.7.7 0 0 1 0-1.4h5.6z"
        stroke="#FFF"
        fill="#FFF"
        mask="url(#b)"
      />
    </g>
  </svg>
)

export default AddAuthor
