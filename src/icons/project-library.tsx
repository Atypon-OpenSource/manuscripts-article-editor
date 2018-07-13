import React from 'react'
import { IconProps } from './types'

const ProjectLibrary = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    <path
      d="M9.994 18.932H4v-5.994c0-1.08.117-2.097.351-3.051.234-.954.594-1.791 1.08-2.511a5.526 5.526 0 0 1 1.863-1.728C8.05 5.216 8.932 5 9.94 5v2.7c-.612 0-1.116.153-1.512.459-.396.306-.72.711-.972 1.215a5.526 5.526 0 0 0-.513 1.701c-.09.63-.135 1.251-.135 1.863h3.186v5.994zm9.882 0h-5.994v-5.994c0-1.08.117-2.097.351-3.051.234-.954.594-1.791 1.08-2.511a5.526 5.526 0 0 1 1.863-1.728C17.932 5.216 18.814 5 19.822 5v2.7c-.612 0-1.116.153-1.512.459-.396.306-.72.711-.972 1.215a5.526 5.526 0 0 0-.513 1.701c-.09.63-.135 1.251-.135 1.863h3.186v5.994z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.5}
      fillRule="evenodd"
      fillOpacity={0}
    />
  </svg>
)

export default ProjectLibrary
