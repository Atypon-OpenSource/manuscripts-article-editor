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

const ProjectsList = (props: IconProps) => (
  <svg width={18} height={19} {...props}>
    <g
      transform="translate(3 3)"
      stroke={props.color || '#7fb5d5'}
      fill="none"
      fillRule="evenodd"
    >
      <rect
        strokeWidth={1.5}
        fill="#FFF"
        x={2.25}
        y={-0.75}
        width={11.5}
        height={13.5}
        rx={1}
      />
      <g transform="translate(0 3)">
        <rect
          strokeWidth={1.5}
          fill="#FFF"
          x={-0.75}
          y={-0.75}
          width={11.5}
          height={13.5}
          rx={1}
        />
        <rect x={2.5} y={1.5} width={3.167} height={1} rx={0.5} />
        <rect x={2.5} y={5.5} width={5.667} height={1} rx={0.5} />
        <rect x={2.5} y={8.5} width={5.667} height={1} rx={0.5} />
      </g>
    </g>
  </svg>
)

export default ProjectsList
