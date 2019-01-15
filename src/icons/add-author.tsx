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
      <circle id="add-author-a" cx={18} cy={18} r={18} />
    </defs>
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <mask id="add-author-b" fill="#fff">
        <use xlinkHref="#add-author-a" />
      </mask>
      <use
        className={'add-author-path'}
        fill={props.color || '#FDCD47'}
        xlinkHref="#add-author-a"
      />
      <path
        d="M17.305 16.793v-5.6a.7.7 0 0 1 1.4 0v5.6h5.6a.7.7 0 0 1 0 1.4h-5.6v5.6a.7.7 0 0 1-1.4 0v-5.6h-5.6a.7.7 0 0 1 0-1.4h5.6z"
        stroke="#FFF"
        fill="#FFF"
        mask="url(#add-author-b)"
      />
    </g>
  </svg>
)

export default AddAuthor
