import React from 'react'
import { IconProps } from './'

const Sort = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    width={props.size}
    height={props.size}
    fill={props.color || '#fff'}
    {...props}
  >
    <path d="M5 12V0H3v12H.5L4 15.5 7.5 12H5z" />
    <path d="M7 9h9v2H7V9zM7 6h7v2H7V6zM7 3h5v2H7V3zM7 0h3v2H7V0z" />
  </svg>
)

export default Sort
