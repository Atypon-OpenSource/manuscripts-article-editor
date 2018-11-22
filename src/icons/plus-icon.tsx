import React from 'react'
import { IconProps } from './types'

const PlusIcon = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    width={props.size || 16}
    height={props.size || 16}
    className={props.className}
    {...props}
  >
    <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g id="PlusIcon">
        <g id="Add-Affiliation">
          <path
            d="M8.79101562,8.79101562 C8.79101562,8.79101562 8.79101562,8.99771929 8.79101562,9.41113281 C8.79101562,9.82454634 8.79101562,10.3046848 8.79101562,10.8515625 C8.79101562,11.3984402 8.79101562,11.8785787 8.79101562,12.2919922 C8.79101562,12.7054057 8.79101562,12.9121094 8.79101562,12.9121094 L7.20898438,12.9121094 L7.20898438,8.79101562 L3.28320312,8.79101562 L3.28320312,7.20898438 L7.20898438,7.20898438 L7.20898438,3.08789062 L8.79101562,3.08789062 L8.79101562,7.20898438 L12.7167969,7.20898438 L12.7167969,8.79101562 L8.79101562,8.79101562 Z"
            id="+"
            fill="#7FB5D5"
          />
          <path
            d="M8,0.5 C3.85786438,0.5 0.5,3.85786438 0.5,8 C0.5,12.1421356 3.85786438,15.5 8,15.5 C12.1421356,15.5 15.5,12.1421356 15.5,8 C15.5,3.85786438 12.1421356,0.5 8,0.5 Z"
            id="Rectangle-3-Copy"
            stroke="#7FB5D5"
          />
        </g>
      </g>
    </g>
  </svg>
)

export default PlusIcon
