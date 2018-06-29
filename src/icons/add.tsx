import React from 'react'
import { IconProps } from './types'

const Add = (props: IconProps) => (
  <svg
    viewBox="0 0 512 512"
    width={props.size || 45}
    height={props.size || 45}
    fill={props.color || '#fff'}
  >
    <path d="M295.516 216.494h154v78.992h-154v-78.992zM62.474 216.514h154.05v78.971H62.474v-78.971z" />
    <path d="M216.525 295.465h79.001v154.05h-79.001v-154.05zM216.525 62.474h79.001v154.041h-79.001V62.474z" />
    <path d="M216.525 216.514h79.001v78.971h-79.001v-78.971z" />
  </svg>
)

export default Add
