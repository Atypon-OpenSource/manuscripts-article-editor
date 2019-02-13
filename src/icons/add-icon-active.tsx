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

const AddIconActive = (props: IconProps) => (
  <svg width={32} height={34} {...props}>
    <g stroke={props.color || '#FFE185'} fill="none" fillRule="evenodd">
      <path
        d="M20 3.144a8 8 0 0 0-8 0L6 6.608a8 8 0 0 0-4 6.928v6.928a8 8 0 0 0 4 6.928l6 3.464a8 8 0 0 0 8 0l6-3.464a8 8 0 0 0 4-6.928v-6.928a8 8 0 0 0-4-6.928l-6-3.464z"
        strokeWidth={2}
      />
    </g>
  </svg>
)

export default AddIconActive
