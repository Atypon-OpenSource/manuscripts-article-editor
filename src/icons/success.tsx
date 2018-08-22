import React from 'react'
import { IconProps } from './types'

const SuccessGreen = (props: IconProps) => (
  <svg height={32} width={32} {...props} transform={'scale(.75 .75)'}>
    <defs>
      <clipPath id="a">
        <path
          d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.372 12 12 12zm0-1.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.2 22.5 12 22.5zM8.831 12.361a1.05 1.05 0 0 1-1.445-.01l.2.197a.954.954 0 0 1 .016-1.388l2.838-2.665a1.08 1.08 0 0 1 1.46 0l5.89 5.502c.404.378.399.99-.005 1.363l.207-.19a1.105 1.105 0 0 1-1.475-.004l-5.39-4.976-2.295 2.171z"
          clipRule="evenodd"
        />
      </clipPath>
      <clipPath id="b">
        <path d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 32)">
      <g clipPath="url(#b)">
        <path
          d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.372 12 12 12zm0-1.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.2 22.5 12 22.5zM8.831 12.361a1.05 1.05 0 0 1-1.445-.01l.2.197a.954.954 0 0 1 .016-1.388l2.838-2.665a1.08 1.08 0 0 1 1.46 0l5.89 5.502c.404.378.399.99-.005 1.363l.207-.19a1.105 1.105 0 0 1-1.475-.004l-5.39-4.976z"
          fill="none"
          stroke="#3a773a"
          strokeWidth={3}
          strokeMiterlimit={10}
        />
      </g>
    </g>
  </svg>
)

export default SuccessGreen
