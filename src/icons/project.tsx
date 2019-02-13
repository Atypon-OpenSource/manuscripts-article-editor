/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { IconProps } from './types'

const ProjectIcon = (props: IconProps) => (
  <svg width={props.size || 18} height={props.size || 19} {...props}>
    <g
      transform="translate(2 2)"
      stroke="currentColor"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        strokeWidth={1.5}
        fill="#FFF"
        x={-0.75}
        y={-0.75}
        width={13.5}
        height={15.5}
        rx={1}
      />
      <rect x={2.5} y={2.5} width={4} height={1} rx={0.5} />
      <rect x={2.5} y={6.5} width={7} height={1} rx={0.5} />
      <rect x={2.5} y={10.5} width={7} height={1} rx={0.5} />
    </g>
  </svg>
)

export default ProjectIcon
