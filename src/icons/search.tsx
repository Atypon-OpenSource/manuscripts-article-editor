import React from 'react'
import { IconProps } from './types'

const SearchIcon = (props: IconProps) => (
  <svg width={38} height={38} {...props}>
    <defs>
      <circle id="a" cx={18} cy={18} r={18} />
    </defs>
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <use fill={props.color || '#7FB5D5'} xlinkHref="#a" />
      <path
        d="M20.015 21.38a6.426 6.426 0 0 1-3.82 1.246 6.336 6.336 0 0 1-5.885-4.005 6.417 6.417 0 0 1 1.488-6.99 6.312 6.312 0 0 1 6.996-1.219 6.391 6.391 0 0 1 3.733 6.079 5.98 5.98 0 0 1-1.273 3.685l4.686 4.565.007.007a.804.804 0 0 1 .201.587.778.778 0 0 1-.27.543.845.845 0 0 1-1.17.067l-4.693-4.566zm-8.484-4.895v.003c.053 2.539 2.14 4.555 4.664 4.508a4.661 4.661 0 0 0 4.324-2.944c.71-1.78.275-3.82-1.098-5.15a4.646 4.646 0 0 0-5.144-.893 4.703 4.703 0 0 0-2.746 4.476z"
        stroke="#FFF"
        strokeWidth={0.3}
        fill="#FFF"
        mask="url(#b)"
      />
    </g>
  </svg>
)

export default SearchIcon
