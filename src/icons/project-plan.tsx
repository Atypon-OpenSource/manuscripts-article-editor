import React from 'react'
import { IconProps } from './types'

const ProjectPlan = (props: IconProps) => (
  <svg width={props.size || 24} height={props.size || 24} {...props}>
    <path
      d="M8.92 12.342H6.67 8.92zm-2.249 0H6.39l-.16-.535a2.001 2.001 0 1 0 .016 1.092l.148-.557h.277zm4.572 0h.375v.375-5.375h.375-.375v5h-.375zm.375.375v4.625h5.337-5.337v-4.625zm5.337 4.625h.277l.149.557a2.001 2.001 0 1 0 .016-1.092l-.16.535h-.282zm-4.962-10h5.24l.148.557a2.001 2.001 0 1 0 .016-1.092l-.16.535h-5.244z"
      stroke="currentColor"
      strokeWidth={1.5}
      fill="none"
      fillRule="evenodd"
    />
  </svg>
)

export default ProjectPlan
