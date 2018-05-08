import React from 'react'
import { IconProps } from './'

const Hamburger = (props: IconProps) => (
  <svg
    height={props.size}
    viewBox="0 0 32 32"
    width={props.size}
    stroke={'currentColor'}
    fill={'currentColor'}
    {...props}
  >
    <path d="M4 10h24a2 2 0 0 0 0-4H4a2 2 0 0 0 0 4zm24 4H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4zm0 8H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4z" />
  </svg>
)

export default Hamburger
